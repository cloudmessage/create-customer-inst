FROM node:18.17.1-alpine3.17

WORKDIR /app
COPY package.json .
COPY pacakge-lock.json .
RUN npm ci
COPY * .
CMD ["node", "worker.js"]
