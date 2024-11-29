FROM node:alpine3.19

WORKDIR /app

# Instala as dependências
COPY package.json package-lock.json ./
RUN npm install

# Copia os arquivos
COPY . ./

# Expõe a porta padrão do React
EXPOSE 3000

# Inicia o cliente
CMD ["npm", "run", "cliente", "--no-warnings"]
