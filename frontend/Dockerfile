#########################################################
# СТАДИЯ 1 — Сборка React-приложения                     #
#########################################################
FROM node:20-slim AS build
WORKDIR /app

# 1. Устанавливаем зависимости отдельно, чтобы кеш слоёв
COPY package*.json ./
# RUN npm ci --omit=dev
RUN npm ci

# 2. Копируем исходники и собираем оптимизированный билд
COPY . .
RUN npm run build

#########################################################
# СТАДИЯ 2 — Запуск. Отдаём статику через nginx         #
#########################################################
FROM nginx:stable-alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
# nginx внутри контейнера слушает 80 порт
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]