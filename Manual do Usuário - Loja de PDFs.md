# Manual do Usuário - Loja de PDFs

## Índice

1. [Introdução](#introdução)
2. [Primeiros Passos](#primeiros-passos)
3. [Painel Administrativo](#painel-administrativo)
4. [Gerenciamento de Produtos](#gerenciamento-de-produtos)
5. [Gerenciamento de Clientes](#gerenciamento-de-clientes)
6. [Gerenciamento de Vendas](#gerenciamento-de-vendas)
7. [Configurações da Loja](#configurações-da-loja)
8. [Interface do Cliente](#interface-do-cliente)
9. [Processo de Compra](#processo-de-compra)
10. [Solução de Problemas](#solução-de-problemas)

---

## Introdução

Bem-vindo ao sistema **Loja de PDFs**, uma solução completa para venda de produtos digitais em formato PDF. Este manual irá guiá-lo através de todas as funcionalidades do sistema, desde a configuração inicial até o gerenciamento diário da sua loja online.

### O que você pode fazer com a Loja de PDFs

- **Vender produtos digitais**: E-books, cursos, relatórios, templates e qualquer conteúdo em PDF
- **Gerenciar clientes**: Sistema completo de cadastro e autenticação
- **Processar vendas**: Carrinho de compras e checkout automatizado
- **Entregar produtos**: Envio automático de PDFs por e-mail após a compra
- **Acompanhar resultados**: Dashboard com estatísticas e relatórios
- **Personalizar a loja**: Cores, logo e configurações visuais

---

## Primeiros Passos

### 1. Instalação do Sistema

Se você ainda não instalou o sistema, siga estas etapas:

```bash
# Clone ou baixe o projeto
cd pdf_store

# Execute o script de instalação
./install.sh

# Inicie o sistema
./start_all.sh
```

### 2. Acesso Inicial

Após a instalação, acesse:
- **Loja**: http://localhost:5173
- **Painel Admin**: http://localhost:5173/admin

### 3. Criação do Primeiro Administrador

1. Acesse http://localhost:5173/admin
2. Clique em "Criar primeiro administrador"
3. Preencha os dados:
   - **Usuário**: Nome de usuário para login (ex: admin)
   - **Senha**: Senha segura com pelo menos 8 caracteres
   - **Confirmar Senha**: Digite a senha novamente
4. Clique em "Criar Administrador"
5. Faça login com as credenciais criadas

---

## Painel Administrativo

### Dashboard Principal

O dashboard é a primeira tela que você vê após fazer login como administrador. Ele apresenta:

#### Estatísticas Principais
- **Total de Produtos**: Número de produtos cadastrados na loja
- **Total de Clientes**: Número de clientes registrados
- **Total de Vendas**: Número total de vendas realizadas
- **Receita Total**: Valor total arrecadado com as vendas

#### Informações Adicionais
- **Vendas Recentes**: Vendas dos últimos 30 dias
- **Produtos Mais Vendidos**: Ranking dos produtos com mais vendas

#### Menu de Navegação
- **Produtos**: Gerenciar catálogo de produtos
- **Clientes**: Visualizar e gerenciar clientes
- **Vendas**: Acompanhar e gerenciar vendas
- **Configurações**: Personalizar a loja

### Navegação

Use o menu lateral ou os cards do dashboard para navegar entre as seções. O botão "Sair" no canto superior direito permite fazer logout do painel administrativo.

---

## Gerenciamento de Produtos

### Acessando o Gerenciamento de Produtos

1. No dashboard, clique em "Produtos" ou acesse diretamente `/admin/produtos`
2. Você verá a lista de todos os produtos cadastrados

### Cadastrando um Novo Produto

1. Clique no botão "Novo Produto"
2. Preencha os campos obrigatórios:

#### Informações Básicas
- **Nome do Produto**: Título que aparecerá na loja
- **Preço**: Valor de venda (use ponto para decimais, ex: 29.90)

#### Informações Opcionais
- **Descrição**: Texto detalhado sobre o produto
- **Caminho do PDF**: Localização do arquivo PDF no servidor
- **URL da Imagem de Capa**: Link para imagem de capa do produto

3. Clique em "Criar Produto"

### Editando um Produto

1. Na lista de produtos, clique em "Editar" no produto desejado
2. Modifique os campos necessários
3. Clique em "Atualizar Produto"

### Desativando um Produto

1. Na lista de produtos, clique em "Desativar" no produto desejado
2. Confirme a ação
3. O produto ficará indisponível na loja, mas não será excluído

### Dicas para Produtos

#### Nomes Eficazes
- Use títulos claros e descritivos
- Inclua palavras-chave relevantes
- Evite nomes muito longos

#### Descrições Atrativas
- Destaque os benefícios do produto
- Use parágrafos curtos e objetivos
- Inclua informações sobre o conteúdo

#### Preços Estratégicos
- Pesquise preços da concorrência
- Considere preços psicológicos (ex: 19.90 em vez de 20.00)
- Teste diferentes faixas de preço

#### Imagens de Qualidade
- Use imagens em alta resolução
- Mantenha proporção adequada (recomendado: 16:9 ou 4:3)
- Certifique-se de que a URL da imagem está acessível

---

## Gerenciamento de Clientes

### Visualizando Clientes

1. No dashboard, clique em "Clientes" ou acesse `/admin/clientes`
2. Você verá a lista de todos os clientes cadastrados

### Informações dos Clientes

Para cada cliente, você pode ver:
- **Nome completo**
- **Email de cadastro**
- **Data de cadastro**
- **Status** (Ativo/Inativo)

### Gerenciando Status dos Clientes

#### Desativar Cliente
1. Clique em "Desativar" no cliente desejado
2. Confirme a ação
3. O cliente não poderá mais fazer login ou compras

#### Reativar Cliente
1. Clique em "Ativar" no cliente desativado
2. O cliente voltará a ter acesso normal à loja

### Estatísticas de Clientes

Na parte inferior da tela, você encontra:
- **Total de Clientes**: Número total cadastrado
- **Clientes Ativos**: Clientes que podem fazer compras
- **Clientes Inativos**: Clientes desativados

### Políticas de Gerenciamento

#### Quando Desativar um Cliente
- Comportamento inadequado
- Solicitação do próprio cliente
- Problemas de pagamento recorrentes
- Violação dos termos de uso

#### Comunicação com Clientes
- Sempre informe sobre mudanças de status
- Mantenha registros das interações
- Seja transparente sobre políticas

---

## Gerenciamento de Vendas

### Visualizando Vendas

1. No dashboard, clique em "Vendas" ou acesse `/admin/vendas`
2. Você verá todas as vendas realizadas

### Informações das Vendas

Para cada venda, você pode ver:
- **ID da Venda**: Número único de identificação
- **Cliente**: Nome do comprador
- **Produto**: Item vendido
- **Data da Venda**: Quando a compra foi realizada
- **Valor Total**: Preço pago
- **Status**: Estado atual da venda
- **Email Enviado**: Se o PDF foi enviado por email

### Status das Vendas

#### Pendente
- Venda registrada mas não processada
- PDF ainda não foi enviado
- Aguardando confirmação de pagamento

#### Concluída
- Venda processada com sucesso
- PDF enviado para o cliente
- Transação finalizada

#### Cancelada
- Venda cancelada por algum motivo
- PDF não será enviado
- Pode ser revertida se necessário

### Alterando Status de Vendas

1. Localize a venda na lista
2. Use o menu dropdown na coluna "Status"
3. Selecione o novo status
4. A alteração é salva automaticamente

### Estatísticas de Vendas

#### Resumo Geral
- **Total de Vendas**: Número total de transações
- **Receita Total**: Valor total arrecadado
- **Vendas Concluídas**: Transações finalizadas
- **Vendas Pendentes**: Transações aguardando processamento

#### Produtos Mais Vendidos
- Ranking dos produtos por número de vendas
- Útil para identificar produtos populares
- Ajuda no planejamento de estoque e marketing

### Reenvio de Emails

Se um cliente não recebeu o PDF:
1. Localize a venda na lista
2. Altere o status para "Concluída" (se não estiver)
3. O sistema tentará reenviar o email automaticamente

---

## Configurações da Loja

### Acessando Configurações

1. No dashboard, clique em "Configurações" ou acesse `/admin/configuracoes`
2. Use as abas para navegar entre as seções

### Configurações Gerais

#### Nome da Loja
- Define o nome que aparece no cabeçalho
- Usado em emails e comunicações
- Escolha um nome profissional e memorável

#### Logo da Loja
- URL da imagem do logo
- Aparece no cabeçalho da loja
- Recomendações:
  - Formato PNG ou JPG
  - Tamanho máximo: 200x60 pixels
  - Fundo transparente (PNG)

### Configurações de Aparência

#### Cores da Loja

**Cor Primária**
- Cor principal da interface
- Usada em botões e destaques
- Escolha uma cor que represente sua marca

**Cor Secundária**
- Cor complementar
- Usada em elementos secundários
- Deve contrastar bem com a primária

#### Prévia das Cores
- Visualize as cores antes de salvar
- Teste a legibilidade
- Considere acessibilidade

### Configurações de Email

#### Servidor SMTP
Configure o servidor de email para envio automático de PDFs:

**Servidor SMTP**
- Endereço do servidor (ex: smtp.gmail.com)
- Consulte seu provedor de email

**Porta SMTP**
- Porta de conexão (geralmente 587 ou 465)
- Use 587 para TLS, 465 para SSL

**Usuário do Email**
- Seu endereço de email completo
- Será usado para autenticação

**Senha do Email**
- Senha da conta de email
- Para Gmail, use senha de aplicativo

**Email Remetente**
- Email que aparece como remetente
- Pode ser diferente do usuário
- Se vazio, usa o email do usuário

#### Configuração para Gmail

1. Ative a verificação em duas etapas
2. Gere uma senha de aplicativo
3. Use a senha de aplicativo no campo "Senha"
4. Configure:
   - Servidor: smtp.gmail.com
   - Porta: 587

#### Teste de Email

1. Preencha um email de teste
2. Clique em "Enviar Teste"
3. Verifique se o email foi recebido
4. Se não funcionar, revise as configurações

### Salvando Configurações

1. Após fazer alterações, clique em "Salvar Configurações"
2. Uma mensagem de confirmação aparecerá
3. As mudanças são aplicadas imediatamente

---

## Interface do Cliente

### Página Principal

A página principal da loja apresenta:

#### Cabeçalho
- **Logo da Loja**: Clicável, leva à página inicial
- **Menu de Navegação**: Produtos, Entrar, Cadastrar
- **Ícone do Carrinho**: Mostra itens adicionados

#### Lista de Produtos
- **Cards de Produtos**: Imagem, nome e preço
- **Botão "Ver Detalhes"**: Leva à página do produto
- **Loading**: Indicador de carregamento

### Página de Produto

Ao clicar em um produto, o cliente vê:

#### Informações Detalhadas
- **Imagem de Capa**: Imagem principal do produto
- **Nome do Produto**: Título completo
- **Preço**: Valor formatado em reais
- **Descrição**: Texto detalhado sobre o produto

#### Ações Disponíveis
- **Adicionar ao Carrinho**: Inclui o produto no carrinho
- **Comprar Agora**: Vai direto para o checkout
- **Voltar**: Retorna à lista de produtos

### Sistema de Autenticação

#### Cadastro de Cliente
1. Cliente clica em "Cadastrar"
2. Preenche formulário:
   - Nome completo
   - Email válido
   - Senha segura
   - Confirmação de senha
3. Clica em "Criar Conta"
4. Recebe confirmação de cadastro

#### Login de Cliente
1. Cliente clica em "Entrar"
2. Informa email e senha
3. Clica em "Entrar"
4. É redirecionado para a loja

#### Perfil do Cliente
Após login, o cliente pode:
- Ver dados pessoais
- Alterar informações
- Ver histórico de compras
- Fazer logout

---

## Processo de Compra

### Carrinho de Compras

#### Adicionando Produtos
1. Cliente navega pelos produtos
2. Clica em "Adicionar ao Carrinho"
3. Produto é incluído no carrinho
4. Contador do carrinho é atualizado

#### Visualizando o Carrinho
1. Cliente clica no ícone do carrinho
2. Vê lista de produtos adicionados
3. Pode alterar quantidades
4. Pode remover produtos

### Checkout

#### Processo de Finalização
1. Cliente clica em "Finalizar Compra"
2. Confirma produtos no carrinho
3. Verifica valor total
4. Clica em "Confirmar Compra"

#### Processamento da Venda
1. Sistema registra a venda
2. Gera ID único da transação
3. Envia email com o PDF
4. Atualiza status para "Concluída"

### Entrega do Produto

#### Email Automático
O cliente recebe um email contendo:
- **Assunto**: Confirmação de compra
- **Corpo**: Detalhes da compra
- **Anexo**: Arquivo PDF comprado
- **Instruções**: Como acessar o produto

#### Formato do Email
```
Assunto: Sua compra foi confirmada - [Nome do Produto]

Olá [Nome do Cliente],

Obrigado por sua compra na [Nome da Loja]!

Produto: [Nome do Produto]
Valor: R$ [Preço]
Data: [Data da Compra]

Seu PDF está anexado a este email.

Atenciosamente,
Equipe [Nome da Loja]
```

### Histórico de Compras

No perfil do cliente:
- Lista de todas as compras
- Data de cada transação
- Status das compras
- Opção de reenvio de email

---

## Solução de Problemas

### Problemas Comuns do Administrador

#### Não Consigo Fazer Login no Admin
**Possíveis Causas:**
- Credenciais incorretas
- Administrador não foi criado
- Problemas de sessão

**Soluções:**
1. Verifique usuário e senha
2. Limpe cookies do navegador
3. Crie novo administrador se necessário
4. Reinicie o backend

#### Produtos Não Aparecem na Loja
**Possíveis Causas:**
- Produtos desativados
- Problemas de conexão com backend
- Erro no carregamento

**Soluções:**
1. Verifique se produtos estão ativos
2. Confirme se backend está rodando
3. Recarregue a página da loja
4. Verifique console do navegador

#### Emails Não São Enviados
**Possíveis Causas:**
- Configurações SMTP incorretas
- Credenciais de email inválidas
- Servidor de email bloqueando

**Soluções:**
1. Teste configurações de email
2. Verifique credenciais
3. Use senha de aplicativo (Gmail)
4. Confirme configurações do servidor

### Problemas Comuns dos Clientes

#### Não Consigo Me Cadastrar
**Possíveis Causas:**
- Email já cadastrado
- Senha muito fraca
- Problemas de conexão

**Orientações para o Cliente:**
1. Verifique se já tem conta
2. Use senha com 8+ caracteres
3. Tente novamente mais tarde
4. Entre em contato com suporte

#### Não Recebi o PDF por Email
**Possíveis Causas:**
- Email na caixa de spam
- Configurações de email incorretas
- Falha no envio

**Soluções:**
1. Verifique caixa de spam
2. Confirme email de cadastro
3. Reenvie via painel admin
4. Entre em contato com cliente

#### Carrinho Não Funciona
**Possíveis Causas:**
- JavaScript desabilitado
- Problemas de cache
- Erro no frontend

**Orientações:**
1. Habilite JavaScript
2. Limpe cache do navegador
3. Tente em navegador diferente
4. Recarregue a página

### Manutenção Preventiva

#### Backup Regular
- Faça backup do banco de dados semanalmente
- Mantenha cópias dos arquivos PDF
- Salve configurações importantes

#### Monitoramento
- Verifique logs de erro regularmente
- Monitore espaço em disco
- Acompanhe performance do sistema

#### Atualizações
- Mantenha dependências atualizadas
- Teste em ambiente de desenvolvimento
- Faça backup antes de atualizar

### Contato para Suporte

Se os problemas persistirem:

- **Email**: suporte@lojapdfs.com
- **Documentação**: Consulte o README.md
- **Logs**: Verifique logs do sistema para mais detalhes

---

## Conclusão

Este manual cobriu todas as funcionalidades principais da Loja de PDFs. Com essas informações, você deve conseguir:

- Configurar e personalizar sua loja
- Gerenciar produtos, clientes e vendas
- Resolver problemas comuns
- Oferecer uma experiência excelente aos seus clientes

Lembre-se de que o sucesso da sua loja depende não apenas da tecnologia, mas também da qualidade dos seus produtos e do atendimento aos clientes.

**Boa sorte com sua loja de PDFs!**

---

*Manual criado por Manus AI - Sistema completo de e-commerce para produtos digitais*

