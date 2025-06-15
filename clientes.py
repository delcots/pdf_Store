from flask import Blueprint, request, jsonify, session
from src.models.store import db, Cliente
from functools import wraps
import re

clientes_bp = Blueprint('clientes', __name__)

def validar_email(email):
    """Valida formato do email"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def login_required(f):
    """Decorator para verificar se o cliente está logado"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'cliente_id' not in session:
            return jsonify({'erro': 'Login necessário'}), 401
        return f(*args, **kwargs)
    return decorated_function

@clientes_bp.route('/clientes/cadastro', methods=['POST'])
def cadastrar_cliente():
    """Cadastra um novo cliente"""
    try:
        data = request.get_json()
        
        # Validação dos dados obrigatórios
        if not data or not data.get('nome') or not data.get('email') or not data.get('senha'):
            return jsonify({'erro': 'Nome, email e senha são obrigatórios'}), 400
        
        # Validar formato do email
        if not validar_email(data['email']):
            return jsonify({'erro': 'Formato de email inválido'}), 400
        
        # Verificar se o email já existe
        cliente_existente = Cliente.query.filter_by(email=data['email']).first()
        if cliente_existente:
            return jsonify({'erro': 'Email já cadastrado'}), 400
        
        # Validar senha (mínimo 6 caracteres)
        if len(data['senha']) < 6:
            return jsonify({'erro': 'Senha deve ter pelo menos 6 caracteres'}), 400
        
        cliente = Cliente(
            nome=data['nome'],
            email=data['email']
        )
        cliente.set_senha(data['senha'])
        
        db.session.add(cliente)
        db.session.commit()
        
        # Fazer login automático após cadastro
        session['cliente_id'] = cliente.id
        session['cliente_nome'] = cliente.nome
        
        return jsonify({
            'mensagem': 'Cliente cadastrado com sucesso',
            'cliente': cliente.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': str(e)}), 500

@clientes_bp.route('/clientes/login', methods=['POST'])
def login_cliente():
    """Faz login do cliente"""
    try:
        data = request.get_json()
        
        if not data or not data.get('email') or not data.get('senha'):
            return jsonify({'erro': 'Email e senha são obrigatórios'}), 400
        
        cliente = Cliente.query.filter_by(email=data['email'], ativo=True).first()
        
        if not cliente or not cliente.check_senha(data['senha']):
            return jsonify({'erro': 'Email ou senha incorretos'}), 401
        
        # Criar sessão
        session['cliente_id'] = cliente.id
        session['cliente_nome'] = cliente.nome
        
        return jsonify({
            'mensagem': 'Login realizado com sucesso',
            'cliente': cliente.to_dict()
        }), 200
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

@clientes_bp.route('/clientes/logout', methods=['POST'])
def logout_cliente():
    """Faz logout do cliente"""
    try:
        session.pop('cliente_id', None)
        session.pop('cliente_nome', None)
        return jsonify({'mensagem': 'Logout realizado com sucesso'}), 200
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

@clientes_bp.route('/clientes/perfil', methods=['GET'])
@login_required
def obter_perfil():
    """Obtém o perfil do cliente logado"""
    try:
        cliente = Cliente.query.get_or_404(session['cliente_id'])
        return jsonify(cliente.to_dict()), 200
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

@clientes_bp.route('/clientes/perfil', methods=['PUT'])
@login_required
def atualizar_perfil():
    """Atualiza o perfil do cliente logado"""
    try:
        cliente = Cliente.query.get_or_404(session['cliente_id'])
        data = request.get_json()
        
        if not data:
            return jsonify({'erro': 'Dados não fornecidos'}), 400
        
        # Atualizar nome se fornecido
        if 'nome' in data:
            cliente.nome = data['nome']
            session['cliente_nome'] = cliente.nome
        
        # Atualizar email se fornecido
        if 'email' in data:
            if not validar_email(data['email']):
                return jsonify({'erro': 'Formato de email inválido'}), 400
            
            # Verificar se o novo email já existe (exceto o atual)
            cliente_existente = Cliente.query.filter(
                Cliente.email == data['email'],
                Cliente.id != cliente.id
            ).first()
            
            if cliente_existente:
                return jsonify({'erro': 'Email já cadastrado'}), 400
            
            cliente.email = data['email']
        
        # Atualizar senha se fornecida
        if 'senha' in data:
            if len(data['senha']) < 6:
                return jsonify({'erro': 'Senha deve ter pelo menos 6 caracteres'}), 400
            cliente.set_senha(data['senha'])
        
        db.session.commit()
        
        return jsonify({
            'mensagem': 'Perfil atualizado com sucesso',
            'cliente': cliente.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': str(e)}), 500

@clientes_bp.route('/clientes/status', methods=['GET'])
def verificar_status():
    """Verifica se o cliente está logado"""
    try:
        if 'cliente_id' in session:
            cliente = Cliente.query.get(session['cliente_id'])
            if cliente and cliente.ativo:
                return jsonify({
                    'logado': True,
                    'cliente': cliente.to_dict()
                }), 200
        
        return jsonify({'logado': False}), 200
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

# Rotas administrativas para gerenciar clientes
@clientes_bp.route('/admin/clientes', methods=['GET'])
def listar_clientes():
    """Lista todos os clientes (rota administrativa)"""
    try:
        # TODO: Adicionar verificação de autenticação de admin
        clientes = Cliente.query.all()
        return jsonify([cliente.to_dict() for cliente in clientes]), 200
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

@clientes_bp.route('/admin/clientes/<int:cliente_id>', methods=['PUT'])
def admin_atualizar_cliente(cliente_id):
    """Atualiza um cliente (rota administrativa)"""
    try:
        # TODO: Adicionar verificação de autenticação de admin
        cliente = Cliente.query.get_or_404(cliente_id)
        data = request.get_json()
        
        if not data:
            return jsonify({'erro': 'Dados não fornecidos'}), 400
        
        if 'ativo' in data:
            cliente.ativo = data['ativo']
        
        db.session.commit()
        
        return jsonify({
            'mensagem': 'Cliente atualizado com sucesso',
            'cliente': cliente.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': str(e)}), 500

