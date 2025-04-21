# === СТАДИЯ 1: сборка React-приложения ===
FROM node:18-alpine AS build
WORKDIR /app
# Копируем package.json и package-lock.json для установки зависимостей
COPY frontend/package*.json ./
# Устанавливаем npm-пакеты
RUN npm install
# Копируем весь исходный код
COPY frontend/ .
# Собираем оптимизированную продакшн‑версию в папку build
RUN npm run build

# === СТАДИЯ 2: отдача статики через nginx ===
FROM nginx:stable-alpine AS runtime
# Копируем сборку из предыдущей стадии
COPY --from=build /app/build /usr/share/nginx/html
# nginx по умолчанию слушает на 80 порту
EXPOSE 80
# Запускаем nginx в фореграунд‑режиме
CMD ["nginx", "-g", "daemon off;"]