FROM node:18.17.1-alpine3.17

WORKDIR /app
COPY package.json .
RUN npm install --legacy-peer-deps
COPY * .
EXPOSE 5672
CMD ["node", "worker.js"]
