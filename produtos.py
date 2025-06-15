from flask import Blueprint, request, jsonify, send_file
from src.models.store import db, Produto
import os
from werkzeug.utils import secure_filename

produtos_bp = Blueprint('produtos', __name__)

# Configuração para upload de arquivos
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@produtos_bp.route('/produtos', methods=['GET'])
def listar_produtos():
    """Lista todos os produtos ativos"""
    try:
        produtos = Produto.query.filter_by(ativo=True).all()
        return jsonify([produto.to_dict() for produto in produtos]), 200
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

@produtos_bp.route('/produtos/<int:produto_id>', methods=['GET'])
def obter_produto(produto_id):
    """Obtém um produto específico"""
    try:
        produto = Produto.query.get_or_404(produto_id)
        if not produto.ativo:
            return jsonify({'erro': 'Produto não encontrado'}), 404
        return jsonify(produto.to_dict()), 200
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

@produtos_bp.route('/produtos', methods=['POST'])
def criar_produto():
    """Cria um novo produto"""
    try:
        data = request.get_json()
        
        # Validação dos dados obrigatórios
        if not data or not data.get('nome') or not data.get('preco'):
            return jsonify({'erro': 'Nome e preço são obrigatórios'}), 400
        
        produto = Produto(
            nome=data['nome'],
            descricao=data.get('descricao', ''),
            preco=float(data['preco']),
            caminho_pdf=data.get('caminho_pdf', ''),
            imagem_capa=data.get('imagem_capa', '')
        )
        
        db.session.add(produto)
        db.session.commit()
        
        return jsonify(produto.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': str(e)}), 500

@produtos_bp.route('/produtos/<int:produto_id>', methods=['PUT'])
def atualizar_produto(produto_id):
    """Atualiza um produto existente"""
    try:
        produto = Produto.query.get_or_404(produto_id)
        data = request.get_json()
        
        if not data:
            return jsonify({'erro': 'Dados não fornecidos'}), 400
        
        # Atualiza os campos fornecidos
        if 'nome' in data:
            produto.nome = data['nome']
        if 'descricao' in data:
            produto.descricao = data['descricao']
        if 'preco' in data:
            produto.preco = float(data['preco'])
        if 'caminho_pdf' in data:
            produto.caminho_pdf = data['caminho_pdf']
        if 'imagem_capa' in data:
            produto.imagem_capa = data['imagem_capa']
        if 'ativo' in data:
            produto.ativo = data['ativo']
        
        db.session.commit()
        
        return jsonify(produto.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': str(e)}), 500

@produtos_bp.route('/produtos/<int:produto_id>', methods=['DELETE'])
def deletar_produto(produto_id):
    """Desativa um produto (soft delete)"""
    try:
        produto = Produto.query.get_or_404(produto_id)
        produto.ativo = False
        db.session.commit()
        
        return jsonify({'mensagem': 'Produto desativado com sucesso'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': str(e)}), 500

@produtos_bp.route('/produtos/<int:produto_id>/download', methods=['GET'])
def download_produto(produto_id):
    """Download do PDF do produto (apenas para vendas confirmadas)"""
    try:
        produto = Produto.query.get_or_404(produto_id)
        
        # Verificar se o arquivo existe
        if not produto.caminho_pdf or not os.path.exists(produto.caminho_pdf):
            return jsonify({'erro': 'Arquivo não encontrado'}), 404
        
        return send_file(produto.caminho_pdf, as_attachment=True)
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

@produtos_bp.route('/produtos/upload', methods=['POST'])
def upload_arquivo():
    """Upload de arquivos PDF e imagens"""
    try:
        if 'arquivo' not in request.files:
            return jsonify({'erro': 'Nenhum arquivo fornecido'}), 400
        
        arquivo = request.files['arquivo']
        
        if arquivo.filename == '':
            return jsonify({'erro': 'Nenhum arquivo selecionado'}), 400
        
        if arquivo and allowed_file(arquivo.filename):
            filename = secure_filename(arquivo.filename)
            
            # Criar diretório de upload se não existir
            upload_path = os.path.join(os.path.dirname(__file__), '..', '..', UPLOAD_FOLDER)
            os.makedirs(upload_path, exist_ok=True)
            
            filepath = os.path.join(upload_path, filename)
            arquivo.save(filepath)
            
            return jsonify({
                'mensagem': 'Arquivo enviado com sucesso',
                'caminho': filepath,
                'nome_arquivo': filename
            }), 200
        else:
            return jsonify({'erro': 'Tipo de arquivo não permitido'}), 400
            
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

