## Tarefas para a Loja de PDF

### Fase 1: Planejamento e estruturação do projeto
- [X] Definir a arquitetura geral da aplicação (frontend: React, backend: Flask, banco de dados: SQLite).
- [X] Escolher as tecnologias a serem utilizadas (React para frontend, Flask para backend, SQLite para banco de dados, smtplib para e-mails).
- [X] Esboçar o modelo de dados para produtos, clientes, vendas e PDFs.
- [X] Criar a estrutura de diretórios do projeto.

### Fase 2: Desenvolvimento do backend e API
- [X] Configurar o ambiente de desenvolvimento do backend.
- [X] Implementar a API para gerenciamento de produtos (CRUD).
- [X] Implementar a API para gerenciamento de clientes (CRUD).
- [X] Implementar a API para gerenciamento de vendas.
- [X] Implementar a lógica de envio de PDF por e-mail após a compra.
- [X] Configurar autenticação e autorização para o painel administrativo.

### Fase 3: Desenvolvimento do frontend da loja
- [X] Configurar o ambiente de desenvolvimento do frontend.
- [X] Criar a interface de listagem de produtos.
- [X] Implementar a página de detalhes do produto.
- [X] Desenvolver o fluxo de compra (carrinho, checkout).
- [X] Implementar o formulário de cadastro/login de clientes.

### Fase 4: Desenvolvimento do painel administrativo
- [X] Criar a interface de login do administrador.
- [X] Desenvolver o painel de gerenciamento de produtos.
- [X] Desenvolver o painel de gerenciamento de clientes.
- [X] Desenvolver o painel de visualização de vendas.
- [X] Implementar funcionalidades de personalização da loja (cores, logo, etc.).

### Fase### Fase 5: Integração e testes do sistema
- [X] Integrar o frontend com as APIs do backend.
- [X] Realizar testes unitários e de integração.
- [X] Testar o fluxo completo da aplicação.
- [X] Verificar a funcionalidade do painel administrativo.vo.

### Fase 6: Preparação para deploy e documentação
- [X] Preparar scripts de deploy.
- [X] Escrever documentação para o usuário (como instalar e usar).
- [X] Escrever documentação para desenvolvedores (estrutura do código).

### Fase 7: Entrega final e demonstração
- [X] Empacotar a aplicação para entrega.
- [X] Fornecer instruções claras para o deploy.
- [X] Realizar uma demonstração das funcionalidades.
- [X] Criar documento de entrega final.




### Modelo de Dados Proposto:

**Produto:**
- `id` (chave primária)
- `nome` (string)
- `descricao` (texto)
- `preco` (float)
- `caminho_pdf` (string - caminho para o arquivo PDF no servidor)
- `imagem_capa` (string - caminho para a imagem de capa do produto)

**Cliente:**
- `id` (chave primária)
- `nome` (string)
- `email` (string - único)
- `senha` (string - hash da senha)

**Venda:**
- `id` (chave primária)
- `id_cliente` (chave estrangeira para Cliente)
- `id_produto` (chave estrangeira para Produto)
- `data_venda` (datetime)
- `preco_total` (float)
- `status` (string - ex: 'pendente', 'concluída', 'cancelada')

**Administrador:**
- `id` (chave primária)
- `usuario` (string - único)
- `senha` (string - hash da senha)

