# Rotas do DeuQuantas

## Paths para Consumidores (`/customer`)

- `/customer/login` – Página de login/cadastro
- `/customer/qr-code` – Escaneamento ou inserção manual do código da mesa
- `/customer/comanda` – Página principal da comanda (visualização de produtos e pedidos)
- `/customer/comanda/timeline` – Linha do tempo dos pedidos
- `/customer/comanda/close` – Confirmação de fechamento da comanda
- `/customer/settings` – Configurações de conta do usuário

## Paths para Estabelecimentos (`/establishment`)

- `/establishment/login` – Login para estabelecimentos
- `/establishment/dashboard` – Painel de métricas e visão geral
- `/establishment/menu` – Gestão do cardápio (adicionar/editar/remover produtos)
- `/establishment/orders` – Fila de pedidos (visualizar e gerenciar pedidos em aberto)
- `/establishment/comandas` – Gestão de comandas abertas (fechamento ou ajustes manuais)
- `/establishment/reports` – Relatórios de vendas e métricas (opcional)
- `/establishment/settings` – Configurações do estabelecimento

## Paths Administrativos (`/admin`)

- `/admin/login` – Login administrativo
- `/admin/dashboard` – Painel geral da plataforma
- `/admin/users` – Gestão de usuários (consumidores e estabelecimentos)
- `/admin/metrics` – Relatórios e métricas globais da plataforma
