FROM node:alpine3.19

WORKDIR /app

# Instala dependências do sistema necessárias para sqlite3
RUN apk update && apk add --no-cache \
    sqlite-dev \
    build-base \
    python3 \
    g++ \
    make \
    gyp

# Copia os arquivos de configuração do npm
COPY package.json package-lock.json ./ 

# Instala pacotes do Node.js
RUN npm install

# Copia os arquivos do servidor
COPY . . 

# Expondo a porta 5000 para o servidor
EXPOSE 5000

# Comando para rodar o servidor
CMD ["node", "index.js"]
