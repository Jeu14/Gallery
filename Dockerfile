FROM node:20-alpine

RUN apk add --no-cache postgresql-client

WORKDIR /usr/src/api

COPY package*.json ./
COPY tsconfig*.json ./
COPY prisma ./prisma/
COPY src ./src/

RUN npm install
RUN npm run build

CMD ["npm", "start:prod"]
