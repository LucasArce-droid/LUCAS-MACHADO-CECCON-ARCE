# Lancheria Delícia - Documentação do Projeto

Este arquivo contém a "ideia" e as diretrizes do projeto para garantir que a identidade do site seja preservada em futuras interações.

## 🎯 Objetivo
Um sistema interno e cardápio digital para uma lancheria (estilo gaúcho), focado em facilidade de uso, visual atraente e gestão de pedidos.

## 🛠️ Funcionalidades Principais
- **Sistema de Login**: Acesso restrito para clientes/usuários.
- **Cardápio Digital**: Organizado por categorias (Xis, Pizzas, Porções, Bebidas).
- **Carrinho de Compras**: Adição de itens com cálculo de total em tempo real.
- **Histórico de Pedidos**: Visualização de pedidos realizados e status de preparo.
- **Tele Entrega**: Aba com informações de contato, endereço e tempo de entrega.

## 🎨 Identidade Visual
- **Cores**: Laranja (#ff6b00) como cor primária, Grafite Escuro (#2d2d2d) para contraste, e Bege Claro (#fffaf5) para o fundo.
- **Tipografia**: Poppins (Sans-serif) para um visual moderno e legível.
- **Estilo**: Cards arredondados (3xl), sombras suaves, e animações de transição fluidas (usando Framer Motion).

## 📋 Estrutura de Dados (Mock)
- O cardápio é gerenciado por uma lista de objetos `MenuItem`.
- Os pedidos são armazenados temporariamente no estado da aplicação como `Order`.

## 🚀 Próximos Passos Sugeridos
- Integração com banco de dados (Firebase) para persistência real de pedidos.
- Painel administrativo para o dono da lancheria gerenciar o cardápio e mudar status dos pedidos.
- Sistema de autenticação real.
