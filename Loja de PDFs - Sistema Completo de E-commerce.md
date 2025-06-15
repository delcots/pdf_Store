# Loja de PDFs - Sistema Completo de E-commerce

## Visão Geral

A **Loja de PDFs** é um sistema completo de e-commerce desenvolvido especificamente para a venda de produtos digitais em formato PDF. O sistema oferece uma solução robusta e pronta para uso, permitindo que empreendedores digitais configurem rapidamente uma loja online profissional para comercializar seus produtos digitais.

### Características Principais

- **Frontend Responsivo**: Interface moderna e responsiva desenvolvida em React
- **Backend Robusto**: API RESTful desenvolvida em Flask com SQLAlchemy
- **Painel Administrativo**: Sistema completo de gerenciamento
- **Envio Automático**: Entrega automática de PDFs por e-mail após a compra
- **Gestão de Clientes**: Sistema completo de cadastro e autenticação
- **Personalização**: Configuração de cores, logo e informações da loja
- **Relatórios**: Dashboard com estatísticas de vendas e produtos

## Arquitetura do Sistema

### Backend (Flask)
- **Framework**: Flask com SQLAlchemy ORM
- **Banco de Dados**: SQLite (configurável para PostgreSQL/MySQL)
- **Autenticação**: Sistema de sessões com cookies seguros
- **Email**: Integração SMTP para envio automático de PDFs
- **CORS**: Configurado para comunicação com frontend

### Frontend (React)
- **Framework**: React 18 com Vite
- **UI Components**: Shadcn/UI com Tailwind CSS
- **Roteamento**: React Router para navegação
- **Estado**: Context API para gerenciamento de estado
- **Responsividade**: Design mobile-first

### Estrutura de Diretórios

```
pdf_store/
├── backend/
│   └── pdf_store_api/
│       ├── src/
│       │   ├── main.py
│       │   ├── models/
│       │   │   ├── user.py
│       │   │   └── store.py
│       │   └── routes/
│       │       ├── produtos.py
│       │       ├── clientes.py
│       │       ├── vendas.py
│       │       └── admin.py
│       ├── venv/
│       └── requirements.txt
└── frontend/
    └── pdf-store-frontend/
        ├── src/
        │   ├── components/
        │   │   ├── admin/
        │   │   └── ui/
        │   ├── contexts/
        │   └── App.jsx
        ├── package.json
        └── index.html
```

## Instalação e Configuração

### Pré-requisitos

- Python 3.11+
- Node.js 20+
- npm ou pnpm

### Configuração do Backend

1. **Navegue para o diretório do backend**:
   ```bash
   cd pdf_store/backend/pdf_store_api
   ```

2. **Ative o ambiente virtual**:
   ```bash
   source venv/bin/activate
   ```

3. **Instale as dependências**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Execute o servidor**:
   ```bash
   python src/main.py
   ```

O backend estará disponível em `http://localhost:5000`

### Configuração do Frontend

1. **Navegue para o diretório do frontend**:
   ```bash
   cd pdf_store/frontend/pdf-store-frontend
   ```

2. **Instale as dependências**:
   ```bash
   pnpm install
   ```

3. **Execute o servidor de desenvolvimento**:
   ```bash
   pnpm run dev --host
   ```

O frontend estará disponível em `http://localhost:5173`

## Configuração Inicial

### 1. Criação do Primeiro Administrador

1. Acesse `http://localhost:5173/admin`
2. Clique em "Criar primeiro administrador"
3. Preencha os dados do administrador
4. Faça login no painel administrativo

### 2. Configuração de Email

No painel administrativo, acesse **Configurações > Email** e configure:

- **Servidor SMTP**: Ex: `smtp.gmail.com`
- **Porta SMTP**: Ex: `587`
- **Usuário**: Seu email
- **Senha**: Senha do email ou token de aplicativo
- **Email Remetente**: Email que aparecerá como remetente

### 3. Personalização da Loja

Em **Configurações > Aparência**:

- **Nome da Loja**: Nome que aparecerá no cabeçalho
- **Logo**: URL da imagem do logo
- **Cores**: Personalize as cores primária e secundária

## Funcionalidades

### Para Administradores

#### Dashboard
- Estatísticas de vendas, produtos e clientes
- Gráficos de produtos mais vendidos
- Resumo de vendas recentes

#### Gerenciamento de Produtos
- Cadastro de novos produtos
- Edição de produtos existentes
- Upload de PDFs
- Configuração de preços e descrições
- Ativação/desativação de produtos

#### Gerenciamento de Clientes
- Visualização de todos os clientes cadastrados
- Ativação/desativação de contas
- Histórico de compras por cliente

#### Gerenciamento de Vendas
- Visualização de todas as vendas
- Alteração de status das vendas
- Reenvio de emails com PDFs
- Relatórios de vendas

#### Configurações
- Personalização visual da loja
- Configuração de email SMTP
- Teste de envio de emails

### Para Clientes

#### Navegação na Loja
- Visualização de produtos disponíveis
- Detalhes de cada produto
- Sistema de busca e filtros

#### Conta do Cliente
- Cadastro de nova conta
- Login e logout
- Perfil do usuário
- Histórico de compras

#### Processo de Compra
- Adicionar produtos ao carrinho
- Finalização da compra
- Recebimento automático do PDF por email

## API Endpoints

### Produtos
- `GET /api/produtos` - Lista todos os produtos
- `POST /api/produtos` - Cria novo produto (admin)
- `PUT /api/produtos/{id}` - Atualiza produto (admin)
- `DELETE /api/produtos/{id}` - Remove produto (admin)

### Clientes
- `POST /api/clientes/cadastro` - Cadastro de cliente
- `POST /api/clientes/login` - Login de cliente
- `POST /api/clientes/logout` - Logout de cliente
- `GET /api/clientes/perfil` - Dados do cliente logado

### Vendas
- `POST /api/vendas` - Processa nova venda
- `GET /api/vendas/cliente` - Histórico do cliente
- `GET /api/admin/vendas` - Todas as vendas (admin)

### Administração
- `POST /api/admin/criar-admin` - Cria primeiro admin
- `POST /api/admin/login` - Login de admin
- `GET /api/admin/dashboard` - Estatísticas do dashboard

## Modelo de Dados

### Produto
```python
{
    "id": int,
    "nome": str,
    "descricao": str,
    "preco": float,
    "caminho_pdf": str,
    "imagem_capa": str,
    "ativo": bool,
    "data_criacao": datetime
}
```

### Cliente
```python
{
    "id": int,
    "nome": str,
    "email": str,
    "senha_hash": str,
    "ativo": bool,
    "data_cadastro": datetime
}
```

### Venda
```python
{
    "id": int,
    "cliente_id": int,
    "produto_id": int,
    "preco_total": float,
    "status": str,  # 'pendente', 'concluida', 'cancelada'
    "email_enviado": bool,
    "data_venda": datetime
}
```

## Segurança

### Autenticação
- Senhas criptografadas com hash seguro
- Sessões baseadas em cookies
- Proteção CSRF

### Autorização
- Rotas administrativas protegidas
- Validação de permissões
- Separação de contextos (cliente/admin)

### Dados Sensíveis
- Configurações de email criptografadas
- Validação de entrada em todos os endpoints
- Sanitização de dados

## Deploy em Produção

### Preparação para Deploy

1. **Configure variáveis de ambiente**:
   ```bash
   export FLASK_ENV=production
   export SECRET_KEY=sua_chave_secreta_aqui
   export DATABASE_URL=sua_url_do_banco
   ```

2. **Build do frontend**:
   ```bash
   cd frontend/pdf-store-frontend
   pnpm run build
   ```

3. **Configure servidor web** (Nginx/Apache)
4. **Configure banco de dados** (PostgreSQL/MySQL)
5. **Configure SSL/HTTPS**

### Opções de Deploy

#### Servidor VPS
- Configure Nginx como proxy reverso
- Use PM2 para gerenciar processos Node.js
- Configure Gunicorn para Flask
- Configure certificado SSL

#### Plataformas Cloud
- **Heroku**: Deploy direto via Git
- **Vercel**: Para frontend estático
- **Railway**: Para aplicações fullstack
- **DigitalOcean App Platform**: Deploy automatizado

## Manutenção

### Backup
- Backup regular do banco de dados
- Backup dos arquivos PDF
- Backup das configurações

### Monitoramento
- Logs de erro do Flask
- Monitoramento de performance
- Alertas de falhas no envio de email

### Atualizações
- Atualizações de segurança regulares
- Backup antes de atualizações
- Testes em ambiente de desenvolvimento

## Solução de Problemas

### Problemas Comuns

#### Backend não inicia
- Verifique se o ambiente virtual está ativado
- Confirme se todas as dependências estão instaladas
- Verifique se a porta 5000 está disponível

#### Frontend não conecta com backend
- Confirme se o backend está rodando
- Verifique configurações de CORS
- Confirme URLs da API no frontend

#### Emails não são enviados
- Verifique configurações SMTP
- Teste conectividade com servidor de email
- Confirme credenciais de email

#### Problemas de permissão
- Verifique se o usuário está logado
- Confirme permissões de administrador
- Limpe cookies e faça login novamente

### Logs e Debug

#### Backend (Flask)
```bash
# Ativar modo debug
export FLASK_DEBUG=1
python src/main.py
```

#### Frontend (React)
```bash
# Console do navegador
# Verificar Network tab para requisições
# Verificar Application tab para localStorage
```

## Contribuição

### Estrutura de Desenvolvimento

1. **Fork do repositório**
2. **Crie branch para feature**: `git checkout -b feature/nova-funcionalidade`
3. **Commit das mudanças**: `git commit -m 'Adiciona nova funcionalidade'`
4. **Push para branch**: `git push origin feature/nova-funcionalidade`
5. **Abra Pull Request**

### Padrões de Código

#### Backend (Python)
- Siga PEP 8
- Use type hints
- Documente funções complexas
- Testes unitários obrigatórios

#### Frontend (JavaScript/React)
- Use ESLint e Prettier
- Componentes funcionais com hooks
- PropTypes para validação
- Testes com Jest/React Testing Library

## Licença

Este projeto está licenciado sob a MIT License - veja o arquivo LICENSE para detalhes.

## Suporte

Para suporte técnico ou dúvidas:

- **Email**: suporte@lojapdfs.com
- **Documentação**: https://docs.lojapdfs.com
- **Issues**: https://github.com/usuario/loja-pdfs/issues

---

**Desenvolvido por Manus AI** - Sistema completo de e-commerce para produtos digitais em PDF.

