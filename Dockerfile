# Stage de desenvolvimento
FROM node:18-alpine AS development
WORKDIR /app

# Copiar arquivos de configuração
COPY frontend-web/package*.json ./
COPY frontend-web/next.config.js ./
COPY frontend-web/tsconfig*.json ./
COPY frontend-web/.env.development ./.env

# Instalar dependências
RUN npm install --force

# Expor a porta
EXPOSE 3000

# Comando para desenvolvimento
CMD ["npm", "run", "dev", "--", "-H", "0.0.0.0"]

# Stage de produção
FROM node:18-alpine AS production
WORKDIR /app

# Copiar arquivos de configuração
COPY frontend-web/package*.json ./
COPY frontend-web/next.config.js ./
COPY frontend-web/tsconfig*.json ./
COPY frontend-web/.env.production ./.env

# Instalar apenas dependências de produção
RUN npm ci --force --only=production

# Copiar o código fonte
COPY frontend-web/ .

# Build da aplicação
RUN npm run build

# Expor a porta
EXPOSE 3000

# Comando para produção
CMD ["npm", "start"]
