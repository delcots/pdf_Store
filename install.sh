#!/bin/bash

# Script de Instalação Automática - Loja de PDFs
# Este script automatiza a instalação completa do sistema

set -e

echo "🚀 Iniciando instalação da Loja de PDFs..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para imprimir mensagens coloridas
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[AVISO]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERRO]${NC} $1"
}

# Verificar se está no diretório correto
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    print_error "Execute este script no diretório raiz do projeto (pdf_store/)"
    exit 1
fi

# Verificar dependências do sistema
print_status "Verificando dependências do sistema..."

# Verificar Python
if ! command -v python3 &> /dev/null; then
    print_error "Python 3 não encontrado. Instale Python 3.11+ antes de continuar."
    exit 1
fi

PYTHON_VERSION=$(python3 --version | cut -d' ' -f2 | cut -d'.' -f1,2)
if [ "$(echo "$PYTHON_VERSION < 3.11" | bc)" -eq 1 ]; then
    print_warning "Python $PYTHON_VERSION detectado. Recomendado Python 3.11+"
fi

# Verificar Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js não encontrado. Instale Node.js 20+ antes de continuar."
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_warning "Node.js $NODE_VERSION detectado. Recomendado Node.js 20+"
fi

# Verificar pnpm
if ! command -v pnpm &> /dev/null; then
    print_status "Instalando pnpm..."
    npm install -g pnpm
fi

print_status "✅ Dependências verificadas com sucesso!"

# Configurar Backend
print_status "Configurando backend..."

cd backend/pdf_store_api

# Criar ambiente virtual se não existir
if [ ! -d "venv" ]; then
    print_status "Criando ambiente virtual Python..."
    python3 -m venv venv
fi

# Ativar ambiente virtual
print_status "Ativando ambiente virtual..."
source venv/bin/activate

# Instalar dependências Python
print_status "Instalando dependências Python..."
pip install --upgrade pip
pip install -r requirements.txt

print_status "✅ Backend configurado com sucesso!"

# Voltar ao diretório raiz
cd ../..

# Configurar Frontend
print_status "Configurando frontend..."

cd frontend/pdf-store-frontend

# Instalar dependências Node.js
print_status "Instalando dependências Node.js..."
pnpm install

print_status "✅ Frontend configurado com sucesso!"

# Voltar ao diretório raiz
cd ../..

# Criar scripts de execução
print_status "Criando scripts de execução..."

# Script para iniciar backend
cat > start_backend.sh << 'EOF'
#!/bin/bash
cd backend/pdf_store_api
source venv/bin/activate
echo "🚀 Iniciando backend na porta 5000..."
python src/main.py
EOF

# Script para iniciar frontend
cat > start_frontend.sh << 'EOF'
#!/bin/bash
cd frontend/pdf-store-frontend
echo "🚀 Iniciando frontend na porta 5173..."
pnpm run dev --host
EOF

# Script para iniciar ambos
cat > start_all.sh << 'EOF'
#!/bin/bash
echo "🚀 Iniciando Loja de PDFs..."

# Função para cleanup
cleanup() {
    echo "🛑 Parando serviços..."
    kill $(jobs -p) 2>/dev/null
    exit 0
}

# Capturar Ctrl+C
trap cleanup SIGINT

# Iniciar backend em background
echo "📡 Iniciando backend..."
cd backend/pdf_store_api
source venv/bin/activate
python src/main.py &
BACKEND_PID=$!

# Aguardar backend inicializar
sleep 3

# Voltar ao diretório raiz
cd ../..

# Iniciar frontend em background
echo "🌐 Iniciando frontend..."
cd frontend/pdf-store-frontend
pnpm run dev --host &
FRONTEND_PID=$!

# Voltar ao diretório raiz
cd ../..

echo ""
echo "✅ Loja de PDFs iniciada com sucesso!"
echo ""
echo "🌐 Frontend: http://localhost:5173"
echo "📡 Backend:  http://localhost:5000"
echo "🔧 Admin:    http://localhost:5173/admin"
echo ""
echo "Pressione Ctrl+C para parar os serviços"

# Aguardar processos
wait
EOF

# Tornar scripts executáveis
chmod +x start_backend.sh
chmod +x start_frontend.sh
chmod +x start_all.sh

# Criar arquivo de configuração de exemplo
cat > .env.example << 'EOF'
# Configurações do Backend
FLASK_ENV=development
SECRET_KEY=sua_chave_secreta_muito_segura_aqui
DATABASE_URL=sqlite:///loja_pdfs.db

# Configurações de Email (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu_email@gmail.com
SMTP_PASSWORD=sua_senha_ou_token_de_app
SMTP_FROM=noreply@suaempresa.com

# Configurações da Loja
STORE_NAME=Minha Loja de PDFs
STORE_LOGO_URL=https://exemplo.com/logo.png
PRIMARY_COLOR=#007bff
SECONDARY_COLOR=#6c757d
EOF

# Criar arquivo de configuração de produção
cat > deploy.sh << 'EOF'
#!/bin/bash

# Script de Deploy para Produção
# Execute este script para preparar a aplicação para produção

set -e

echo "🚀 Preparando deploy para produção..."

# Build do frontend
echo "📦 Fazendo build do frontend..."
cd frontend/pdf-store-frontend
pnpm run build

# Voltar ao diretório raiz
cd ../..

# Criar diretório de distribuição
mkdir -p dist

# Copiar arquivos do backend
echo "📋 Copiando arquivos do backend..."
cp -r backend/pdf_store_api/src dist/
cp backend/pdf_store_api/requirements.txt dist/

# Copiar build do frontend
echo "📋 Copiando build do frontend..."
cp -r frontend/pdf-store-frontend/dist dist/frontend

# Criar arquivo de configuração para produção
cat > dist/gunicorn.conf.py << 'GUNICORN_EOF'
# Configuração do Gunicorn para produção
bind = "0.0.0.0:5000"
workers = 4
worker_class = "sync"
worker_connections = 1000
max_requests = 1000
max_requests_jitter = 100
timeout = 30
keepalive = 2
preload_app = True
GUNICORN_EOF

# Criar script de inicialização para produção
cat > dist/start_production.sh << 'PROD_EOF'
#!/bin/bash
# Script de inicialização para produção

# Instalar dependências
pip install -r requirements.txt
pip install gunicorn

# Iniciar aplicação com Gunicorn
gunicorn -c gunicorn.conf.py main:app
PROD_EOF

chmod +x dist/start_production.sh

echo "✅ Deploy preparado com sucesso!"
echo "📁 Arquivos de produção em: ./dist/"
echo ""
echo "Para deploy em servidor:"
echo "1. Copie a pasta 'dist' para seu servidor"
echo "2. Execute: ./start_production.sh"
echo "3. Configure nginx como proxy reverso"
EOF

chmod +x deploy.sh

# Criar arquivo Docker (opcional)
cat > Dockerfile << 'EOF'
# Dockerfile para Loja de PDFs
FROM python:3.11-slim

# Instalar Node.js
RUN apt-get update && apt-get install -y \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g pnpm \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos
COPY . .

# Instalar dependências do backend
WORKDIR /app/backend/pdf_store_api
RUN python -m venv venv \
    && . venv/bin/activate \
    && pip install -r requirements.txt

# Instalar dependências do frontend e fazer build
WORKDIR /app/frontend/pdf-store-frontend
RUN pnpm install && pnpm run build

# Voltar ao diretório raiz
WORKDIR /app

# Expor portas
EXPOSE 5000 5173

# Script de inicialização
CMD ["./start_all.sh"]
EOF

# Criar docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  loja-pdfs:
    build: .
    ports:
      - "5000:5000"
      - "5173:5173"
    volumes:
      - ./data:/app/data
      - ./uploads:/app/uploads
    environment:
      - FLASK_ENV=production
      - SECRET_KEY=sua_chave_secreta_aqui
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - loja-pdfs
    restart: unless-stopped
EOF

print_status "✅ Instalação concluída com sucesso!"
print_status ""
print_status "🎉 Próximos passos:"
print_status "1. Execute: ./start_all.sh"
print_status "2. Acesse: http://localhost:5173"
print_status "3. Configure o primeiro administrador em: http://localhost:5173/admin"
print_status ""
print_status "📚 Scripts disponíveis:"
print_status "• ./start_all.sh     - Inicia frontend e backend"
print_status "• ./start_backend.sh - Inicia apenas o backend"
print_status "• ./start_frontend.sh - Inicia apenas o frontend"
print_status "• ./deploy.sh        - Prepara para produção"
print_status ""
print_status "📖 Consulte o README.md para mais informações"

