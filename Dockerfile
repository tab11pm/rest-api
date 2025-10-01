FROM node:20-alpine

WORKDIR /app

# Установим зависимости отдельно, чтобы лучше кешировалось
COPY package*.json ./
RUN npm ci --only=production

# Копируем исходники
COPY src ./src

ENV NODE_ENV=production \
    PORT=3000

EXPOSE 3000
CMD ["node", "src/server.js"]