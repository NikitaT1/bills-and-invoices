FROM node:15

WORKDIR /app

COPY . .

RUN npm install

ENV   PORT=7000
ENV   DB_NAME='bills-and-invoices'
ENV   DB_USER='docker'
ENV   DB_PASSWORD='123456'
ENV   DB_HOST='postgress'
ENV   DB_PORT=5432    


CMD ["npm", "start"]