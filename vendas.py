from flask import Blueprint, request, jsonify, session
from src.models.store import db, Venda, Produto, Cliente, ConfiguracaoLoja
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
import os
from functools import wraps

vendas_bp = Blueprint('vendas', __name__)

def login_required(f):
    """Decorator para verificar se o cliente está logado"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'cliente_id' not in session:
            return jsonify({'erro': 'Login necessário'}), 401
        return f(*args, **kwargs)
    return decorated_function

def enviar_email_pdf(cliente_email, cliente_nome, produto_nome, caminho_pdf):
    """Envia o PDF por email para o cliente"""
    try:
        # Obter configurações de email
        config = ConfiguracaoLoja.query.first()
        if not config or not config.email_smtp_host:
            return False, "Configurações de email não encontradas"
        
        # Criar mensagem
        msg = MIMEMultipart()
        msg['From'] = config.email_remetente or config.email_usuario
        msg['To'] = cliente_email
        msg['Subject'] = f"Seu produto: {produto_nome}"
        
        # Corpo do email
        corpo = f"""
        Olá {cliente_nome},

        Obrigado por sua compra! Segue em anexo o PDF do produto "{produto_nome}".

        Atenciosamente,
        {config.nome_loja}
        """
        
        msg.attach(MIMEText(corpo, 'plain'))
        
        # Anexar PDF
        if os.path.exists(caminho_pdf):
            with open(caminho_pdf, "rb") as attachment:
                part = MIMEBase('application', 'octet-stream')
                part.set_payload(attachment.read())
                encoders.encode_base64(part)
                part.add_header(
                    'Content-Disposition',
                    f'attachment; filename= {os.path.basename(caminho_pdf)}'
                )
                msg.attach(part)
        else:
            return False, "Arquivo PDF não encontrado"
        
        # Enviar email
        server = smtplib.SMTP(config.email_smtp_host, config.email_smtp_port)
        server.starttls()
        server.login(config.email_usuario, config.email_senha)
        text = msg.as_string()
        server.sendmail(config.email_usuario, cliente_email, text)
        server.quit()
        
        return True, "Email enviado com sucesso"
        
    except Exception as e:
        return False, f"Erro ao enviar email: {str(e)}"

@vendas_bp.route('/vendas/comprar', methods=['POST'])
@login_required
def processar_compra():
    """Processa uma compra"""
    try:
        data = request.get_json()
        
        if not data or not data.get('produto_id'):
            return jsonify({'erro': 'ID do produto é obrigatório'}), 400
        
        # Verificar se o produto existe e está ativo
        produto = Produto.query.filter_by(id=data['produto_id'], ativo=True).first()
        if not produto:
            return jsonify({'erro': 'Produto não encontrado'}), 404
        
        # Obter cliente
        cliente = Cliente.query.get(session['cliente_id'])
        if not cliente:
            return jsonify({'erro': 'Cliente não encontrado'}), 404
        
        # Criar venda
        venda = Venda(
            id_cliente=cliente.id,
            id_produto=produto.id,
            preco_total=produto.preco,
            status='concluida'  # Por simplicidade, consideramos a compra como concluída
        )
        
        db.session.add(venda)
        db.session.commit()
        
        # Tentar enviar email com o PDF
        sucesso_email, mensagem_email = enviar_email_pdf(
            cliente.email,
            cliente.nome,
            produto.nome,
            produto.caminho_pdf
        )
        
        if sucesso_email:
            venda.email_enviado = True
            db.session.commit()
        
        return jsonify({
            'mensagem': 'Compra realizada com sucesso',
            'venda': venda.to_dict(),
            'email_enviado': sucesso_email,
            'mensagem_email': mensagem_email
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': str(e)}), 500

@vendas_bp.route('/vendas/minhas-compras', methods=['GET'])
@login_required
def minhas_compras():
    """Lista as compras do cliente logado"""
    try:
        vendas = Venda.query.filter_by(id_cliente=session['cliente_id']).order_by(Venda.data_venda.desc()).all()
        return jsonify([venda.to_dict() for venda in vendas]), 200
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

@vendas_bp.route('/vendas/<int:venda_id>/reenviar-email', methods=['POST'])
@login_required
def reenviar_email(venda_id):
    """Reenvia o email com o PDF para uma venda específica"""
    try:
        # Verificar se a venda pertence ao cliente logado
        venda = Venda.query.filter_by(id=venda_id, id_cliente=session['cliente_id']).first()
        if not venda:
            return jsonify({'erro': 'Venda não encontrada'}), 404
        
        # Obter dados necessários
        cliente = venda.cliente
        produto = venda.produto
        
        # Tentar enviar email
        sucesso_email, mensagem_email = enviar_email_pdf(
            cliente.email,
            cliente.nome,
            produto.nome,
            produto.caminho_pdf
        )
        
        if sucesso_email:
            venda.email_enviado = True
            db.session.commit()
        
        return jsonify({
            'mensagem': 'Tentativa de reenvio realizada',
            'email_enviado': sucesso_email,
            'mensagem_email': mensagem_email
        }), 200
        
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

# Rotas administrativas para gerenciar vendas
@vendas_bp.route('/admin/vendas', methods=['GET'])
def listar_vendas():
    """Lista todas as vendas (rota administrativa)"""
    try:
        # TODO: Adicionar verificação de autenticação de admin
        vendas = Venda.query.order_by(Venda.data_venda.desc()).all()
        return jsonify([venda.to_dict() for venda in vendas]), 200
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

@vendas_bp.route('/admin/vendas/<int:venda_id>', methods=['GET'])
def obter_venda(venda_id):
    """Obtém uma venda específica (rota administrativa)"""
    try:
        # TODO: Adicionar verificação de autenticação de admin
        venda = Venda.query.get_or_404(venda_id)
        return jsonify(venda.to_dict()), 200
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

@vendas_bp.route('/admin/vendas/<int:venda_id>/status', methods=['PUT'])
def atualizar_status_venda(venda_id):
    """Atualiza o status de uma venda (rota administrativa)"""
    try:
        # TODO: Adicionar verificação de autenticação de admin
        venda = Venda.query.get_or_404(venda_id)
        data = request.get_json()
        
        if not data or 'status' not in data:
            return jsonify({'erro': 'Status é obrigatório'}), 400
        
        status_validos = ['pendente', 'concluida', 'cancelada']
        if data['status'] not in status_validos:
            return jsonify({'erro': f'Status deve ser um dos: {", ".join(status_validos)}'}), 400
        
        venda.status = data['status']
        db.session.commit()
        
        return jsonify({
            'mensagem': 'Status da venda atualizado com sucesso',
            'venda': venda.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'erro': str(e)}), 500

@vendas_bp.route('/admin/vendas/estatisticas', methods=['GET'])
def estatisticas_vendas():
    """Obtém estatísticas de vendas (rota administrativa)"""
    try:
        # TODO: Adicionar verificação de autenticação de admin
        from sqlalchemy import func
        
        # Total de vendas
        total_vendas = Venda.query.count()
        
        # Total de receita
        total_receita = db.session.query(func.sum(Venda.preco_total)).scalar() or 0
        
        # Vendas por status
        vendas_por_status = db.session.query(
            Venda.status,
            func.count(Venda.id)
        ).group_by(Venda.status).all()
        
        # Produtos mais vendidos
        produtos_mais_vendidos = db.session.query(
            Produto.nome,
            func.count(Venda.id).label('total_vendas')
        ).join(Venda).group_by(Produto.id, Produto.nome).order_by(func.count(Venda.id).desc()).limit(5).all()
        
        return jsonify({
            'total_vendas': total_vendas,
            'total_receita': float(total_receita),
            'vendas_por_status': dict(vendas_por_status),
            'produtos_mais_vendidos': [
                {'nome': nome, 'total_vendas': total}
                for nome, total in produtos_mais_vendidos
            ]
        }), 200
        
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

