# Dockerfile
FROM node:22-alpine

WORKDIR /app

# Copia apenas os manifests primeiro (para cache de dependências)
COPY package*.json ./

# Instala dependências
RUN npm ci

# Copia o restante do código
COPY . .

# Compila a aplicação
RUN npm run build

# Expõe a porta padrão do Express
EXPOSE 3000

# Roda o servidor Node
CMD ["node", "dist/index.js"]