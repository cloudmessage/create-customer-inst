FROM node:18.17.1-alpine3.17

WORKDIR /app
EXPOSE 5672
COPY package.json .
RUN npm install --legacy-peer-deps
COPY * .
CMD ["node", "worker.js"]
