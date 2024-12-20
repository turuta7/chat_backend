# Указываем базовый образ
FROM node:20

# Указываем рабочую директорию
WORKDIR /app

# Копируем файлы в контейнер
COPY package*.json ./
RUN npm install

COPY . .

# Указываем порт и команду для запуска
EXPOSE 3020

# Генерация Prisma Client
RUN npx prisma generate --schema=src/db/schema.prisma

CMD ["npm", "run", "dev"]
