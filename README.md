# NCF Seguros PWA

Aplicativo web progressivo (PWA) para gerenciamento de indicações de seguros.

## 🚀 Tecnologias

- React + TypeScript
- TailwindCSS
- Firebase Auth
- Express.js
- PostgreSQL

## 📋 Pré-requisitos

- Node.js >= 18
- PostgreSQL
- Conta Firebase

## 🔧 Instalação

### Usando Git CLI
```bash
# Clone o repositório
git clone git@github.com:RogerioMatos75/NCFSeguros_PWA.git

# Instale as dependências
npm install
```

### Usando GitHub Desktop
1. Abra o GitHub Desktop
2. Clique em File > Clone Repository
3. Na aba URL, cole: `https://github.com/RogerioMatos75/NCFSeguros_PWA.git`
4. Escolha onde salvar o projeto
5. Clique em Clone

Depois de clonar:
```bash
# Configure as variáveis de ambiente
cp .env.example .env

# Inicie o servidor de desenvolvimento
npm run dev
```

### ⚙️ Configuração do Vercel

1. Acesse o dashboard do Vercel
2. Selecione seu projeto
3. Vá em Settings > Environment Variables
4. Clique em "Import" (ícone de upload)
5. Selecione seu arquivo .env local
6. Verifique se todas as variáveis foram importadas corretamente

## 🛠️ Scripts Disponíveis

- `npm run dev` - Inicia o ambiente de desenvolvimento
- `npm run build` - Gera build de produção
- `npm start` - Inicia o servidor em produção

## 📦 Estrutura do Projeto

```
NCFSeguros_PWA/
├── client/         # Frontend React
├── server/         # Backend Express
└── shared/         # Tipos e schemas compartilhados
```

## 📄 Licença

Este projeto está sob a licença MIT.
