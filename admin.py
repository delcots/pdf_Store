from flask import Blueprint, request, jsonify, session
from src.models.store import db, Administrador, ConfiguracaoLoja
from functools import wraps

admin_bp = Blueprint('admin', __name__)

def admin_required(f):
    """Decorator para verificar se o administrador está logado"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'admin_id' not in session:
            return jsonify({'erro': 'Acesso administrativo necessário'}), 401
        return f(*args, **kwargs)
    return decorated_function

@admin_bp.route('/admin/login', methods=['POST'])
def login_admin():
    """Faz login do administrador"""
    try:
        data = request.get_json()
        
        if not data or not data.get('usuario') or not data.get('senha'):
            return jsonify({'erro': 'Usuário e senha são obrigatórios'}), 400
        
        admin = Administrador.query.filter_by(usuario=data['usuario'], ativo=True).first()
        
        if not admin or not admin.check_senha(data['senha']):
            return jsonify({'erro': 'Usuário ou senha incorretos'}), 401
        
        # Criar sessão administrativa
        session['admin_id'] = admin.id
        session['admin_usuario'] = admin.usuario
        
        return jsonify({
            'mensagem': 'Login administrativo realizado com sucesso',
            'admin': admin.to_dict()
        }), 200
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

@admin_bp.route('/admin/logout', methods=['POST'])
def logout_admin():
    """Faz logout do administrador"""
    try:
        session.pop('admin_id', None)
        session.pop('admin_usuario', None)
        return jsonify({'mensagem': 'Logout administrativo realizado com sucesso'}), 200
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

@admin_bp.route('/admin/status', methods=['GET'])
def verificar_status_admin():
    """Verifica se o administrador está logado"""
    try:
        if 'admin_id' in session:
            admin = Administrador.query.get(session['admin_id'])
            if admin and admin.ativo:
                return jsonify({
                    'logado': True,
                    'admin': admin.to_dict()
                }), 200
        
        return jsonify({'logado': False}), 200
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

@admin_bp.route('/admin/criar-admin', methods=['POST'])
def criar_admin():
    """Cria um novo administrador (apenas se não existir nenhum)"""
    try:
        # Verificar se já existe algum administrador
        admin_existente = Administrador.query.first()
        if admin_existente:
            return jsonify({'erro': 'Já existe um administrador cadastrado'}), 400
        
        data = request.get_json()
        
        if not data or not data.get('usuario') or not data.get('senha'):
            return jsonify({'erro': 'Usuário e senha são obrigatórios'}), 400
        
        # Validar senha (mínimo 8 caracteres)
        if len(data['senha']) < 8:
            return jsonify({'erro': 'Senha deve ter pelo menos 8 caracteres'}), 400
        
        admin = Administrador(usuario=data['usuario'])
        admin.set_senha(data['senha'])
        
        db.session.add(admin)
        db.session.commit()
        
        return jsonify({
            'mensagem': 'Administrador criado com sucesso',
            'admin': admin.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': str(e)}), 500

@admin_bp.route('/admin/configuracao', methods=['GET'])
@admin_required
def obter_configuracao():
    """Obtém as configurações da loja"""
    try:
        config = ConfiguracaoLoja.query.first()
        if not config:
            # Criar configuração padrão se não existir
            config = ConfiguracaoLoja()
            db.session.add(config)
            db.session.commit()
        
        return jsonify(config.to_dict()), 200
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

@admin_bp.route('/admin/configuracao', methods=['PUT'])
@admin_required
def atualizar_configuracao():
    """Atualiza as configurações da loja"""
    try:
        config = ConfiguracaoLoja.query.first()
        if not config:
            config = ConfiguracaoLoja()
            db.session.add(config)
        
        data = request.get_json()
        if not data:
            return jsonify({'erro': 'Dados não fornecidos'}), 400
        
        # Atualizar campos fornecidos
        if 'nome_loja' in data:
            config.nome_loja = data['nome_loja']
        if 'cor_primaria' in data:
            config.cor_primaria = data['cor_primaria']
        if 'cor_secundaria' in data:
            config.cor_secundaria = data['cor_secundaria']
        if 'logo_path' in data:
            config.logo_path = data['logo_path']
        if 'email_smtp_host' in data:
            config.email_smtp_host = data['email_smtp_host']
        if 'email_smtp_port' in data:
            config.email_smtp_port = data['email_smtp_port']
        if 'email_usuario' in data:
            config.email_usuario = data['email_usuario']
        if 'email_senha' in data:
            config.email_senha = data['email_senha']
        if 'email_remetente' in data:
            config.email_remetente = data['email_remetente']
        
        db.session.commit()
        
        return jsonify({
            'mensagem': 'Configurações atualizadas com sucesso',
            'configuracao': config.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': str(e)}), 500

@admin_bp.route('/admin/testar-email', methods=['POST'])
@admin_required
def testar_email():
    """Testa as configurações de email"""
    try:
        data = request.get_json()
        if not data or not data.get('email_teste'):
            return jsonify({'erro': 'Email de teste é obrigatório'}), 400
        
        config = ConfiguracaoLoja.query.first()
        if not config or not config.email_smtp_host:
            return jsonify({'erro': 'Configurações de email não encontradas'}), 400
        
        import smtplib
        from email.mime.text import MIMEText
        
        # Criar mensagem de teste
        msg = MIMEText('Este é um email de teste da sua loja de PDFs.')
        msg['Subject'] = 'Teste de Email - Loja de PDFs'
        msg['From'] = config.email_remetente or config.email_usuario
        msg['To'] = data['email_teste']
        
        # Tentar enviar
        server = smtplib.SMTP(config.email_smtp_host, config.email_smtp_port)
        server.starttls()
        server.login(config.email_usuario, config.email_senha)
        server.send_message(msg)
        server.quit()
        
        return jsonify({'mensagem': 'Email de teste enviado com sucesso'}), 200
        
    except Exception as e:
        return jsonify({'erro': f'Erro ao enviar email de teste: {str(e)}'}), 500

@admin_bp.route('/admin/dashboard', methods=['GET'])
@admin_required
def dashboard():
    """Obtém dados do dashboard administrativo"""
    try:
        from src.models.store import Produto, Cliente, Venda
        from sqlalchemy import func
        from datetime import datetime, timedelta
        
        # Contadores gerais
        total_produtos = Produto.query.filter_by(ativo=True).count()
        total_clientes = Cliente.query.filter_by(ativo=True).count()
        total_vendas = Venda.query.count()
        
        # Receita total
        receita_total = db.session.query(func.sum(Venda.preco_total)).scalar() or 0
        
        # Vendas dos últimos 30 dias
        data_limite = datetime.utcnow() - timedelta(days=30)
        vendas_recentes = Venda.query.filter(Venda.data_venda >= data_limite).count()
        
        # Produtos mais vendidos
        produtos_mais_vendidos = db.session.query(
            Produto.nome,
            func.count(Venda.id).label('total_vendas')
        ).join(Venda).group_by(Produto.id, Produto.nome).order_by(func.count(Venda.id).desc()).limit(5).all()
        
        return jsonify({
            'total_produtos': total_produtos,
            'total_clientes': total_clientes,
            'total_vendas': total_vendas,
            'receita_total': float(receita_total),
            'vendas_recentes': vendas_recentes,
            'produtos_mais_vendidos': [
                {'nome': nome, 'total_vendas': total}
                for nome, total in produtos_mais_vendidos
            ]
        }), 200
        
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

# Rota pública para obter configurações básicas da loja (sem dados sensíveis)
@admin_bp.route('/configuracao-publica', methods=['GET'])
def configuracao_publica():
    """Obtém configurações públicas da loja"""
    try:
        config = ConfiguracaoLoja.query.first()
        if not config:
            config = ConfiguracaoLoja()
        
        return jsonify({
            'nome_loja': config.nome_loja,
            'cor_primaria': config.cor_primaria,
            'cor_secundaria': config.cor_secundaria,
            'logo_path': config.logo_path
        }), 200
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

