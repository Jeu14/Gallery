FROM node:20-bullseye

RUN apt-get update && apt-get install -y \
  libssl1.1 \
  postgresql-client \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/api

COPY package*.json ./
COPY tsconfig*.json ./
COPY prisma ./prisma/
COPY src ./src/

RUN npm install
RUN npm run build

CMD ["npm", "run", "start:prod"]
