from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class Produto(db.Model):
    __tablename__ = 'produtos'
    
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(200), nullable=False)
    descricao = db.Column(db.Text, nullable=True)
    preco = db.Column(db.Float, nullable=False)
    caminho_pdf = db.Column(db.String(500), nullable=False)
    imagem_capa = db.Column(db.String(500), nullable=True)
    ativo = db.Column(db.Boolean, default=True)
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relacionamento com vendas
    vendas = db.relationship('Venda', backref='produto', lazy=True)
    
    def __repr__(self):
        return f'<Produto {self.nome}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'descricao': self.descricao,
            'preco': self.preco,
            'caminho_pdf': self.caminho_pdf,
            'imagem_capa': self.imagem_capa,
            'ativo': self.ativo,
            'data_criacao': self.data_criacao.isoformat() if self.data_criacao else None
        }

class Cliente(db.Model):
    __tablename__ = 'clientes'
    
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    senha_hash = db.Column(db.String(128), nullable=False)
    ativo = db.Column(db.Boolean, default=True)
    data_cadastro = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relacionamento com vendas
    vendas = db.relationship('Venda', backref='cliente', lazy=True)
    
    def __repr__(self):
        return f'<Cliente {self.nome}>'
    
    def set_senha(self, senha):
        self.senha_hash = generate_password_hash(senha)
    
    def check_senha(self, senha):
        return check_password_hash(self.senha_hash, senha)
    
    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'email': self.email,
            'ativo': self.ativo,
            'data_cadastro': self.data_cadastro.isoformat() if self.data_cadastro else None
        }

class Venda(db.Model):
    __tablename__ = 'vendas'
    
    id = db.Column(db.Integer, primary_key=True)
    id_cliente = db.Column(db.Integer, db.ForeignKey('clientes.id'), nullable=False)
    id_produto = db.Column(db.Integer, db.ForeignKey('produtos.id'), nullable=False)
    data_venda = db.Column(db.DateTime, default=datetime.utcnow)
    preco_total = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(50), default='pendente')  # pendente, concluida, cancelada
    email_enviado = db.Column(db.Boolean, default=False)
    
    def __repr__(self):
        return f'<Venda {self.id}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'id_cliente': self.id_cliente,
            'id_produto': self.id_produto,
            'data_venda': self.data_venda.isoformat() if self.data_venda else None,
            'preco_total': self.preco_total,
            'status': self.status,
            'email_enviado': self.email_enviado,
            'cliente_nome': self.cliente.nome if self.cliente else None,
            'produto_nome': self.produto.nome if self.produto else None
        }

class Administrador(db.Model):
    __tablename__ = 'administradores'
    
    id = db.Column(db.Integer, primary_key=True)
    usuario = db.Column(db.String(80), unique=True, nullable=False)
    senha_hash = db.Column(db.String(128), nullable=False)
    ativo = db.Column(db.Boolean, default=True)
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<Administrador {self.usuario}>'
    
    def set_senha(self, senha):
        self.senha_hash = generate_password_hash(senha)
    
    def check_senha(self, senha):
        return check_password_hash(self.senha_hash, senha)
    
    def to_dict(self):
        return {
            'id': self.id,
            'usuario': self.usuario,
            'ativo': self.ativo,
            'data_criacao': self.data_criacao.isoformat() if self.data_criacao else None
        }

class ConfiguracaoLoja(db.Model):
    __tablename__ = 'configuracao_loja'
    
    id = db.Column(db.Integer, primary_key=True)
    nome_loja = db.Column(db.String(200), default='Loja de PDFs')
    cor_primaria = db.Column(db.String(7), default='#007bff')  # Cor em hexadecimal
    cor_secundaria = db.Column(db.String(7), default='#6c757d')
    logo_path = db.Column(db.String(500), nullable=True)
    email_smtp_host = db.Column(db.String(100), nullable=True)
    email_smtp_port = db.Column(db.Integer, default=587)
    email_usuario = db.Column(db.String(120), nullable=True)
    email_senha = db.Column(db.String(128), nullable=True)
    email_remetente = db.Column(db.String(120), nullable=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'nome_loja': self.nome_loja,
            'cor_primaria': self.cor_primaria,
            'cor_secundaria': self.cor_secundaria,
            'logo_path': self.logo_path,
            'email_smtp_host': self.email_smtp_host,
            'email_smtp_port': self.email_smtp_port,
            'email_usuario': self.email_usuario,
            'email_remetente': self.email_remetente
        }

