FROM node:10-slim
USER node

RUN mkdir -p /home/node/dist/server

WORKDIR /home/node/dist/server

COPY --chown=node package*.json ./

RUN npm install

COPY --chown=node . .

ENV PORT=5000

EXPOSE ${PORT}




CMD ["npm", "start"]