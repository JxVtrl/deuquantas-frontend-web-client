# Etapa 1: Build
FROM node:18-alpine AS builder

# Definir o diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar o restante do código do projeto
COPY . .

# Construir a aplicação Next.js
RUN npm run build

# Etapa 2: Produção
FROM nginx:alpine AS production

# Copiar arquivos de build para o NGINX
COPY --from=builder /app/.next /usr/share/nginx/html

# Copiar o arquivo estático para configurações de NGINX (se necessário)
# COPY nginx.conf /etc/nginx/nginx.conf

# Expor a porta 80 para acesso
EXPOSE 80

# Iniciar o NGINX
CMD ["nginx", "-g", "daemon off;"]
