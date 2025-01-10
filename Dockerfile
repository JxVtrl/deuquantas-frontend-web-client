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

RUN rm -rf /usr/share/nginx/html/*

# Copiar os arquivos estáticos exportados para o diretório padrão do NGINX
COPY --from=builder /app/out /usr/share/nginx/html

# Expor a porta do NGINX
EXPOSE 80

# Iniciar o NGINX
CMD ["nginx", "-g", "daemon off;"]
