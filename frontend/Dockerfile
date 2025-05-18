#########################################################
# СТАДИЯ 1 — Сборка React-приложения                     #
#########################################################
FROM node:24-alpine AS build
WORKDIR /app

# 1. Устанавливаем зависимости отдельно, чтобы кеш слоёв
COPY package*.json ./
RUN npm ci --omit=dev

# 2. Копируем исходники и собираем оптимизированный билд
COPY . .
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
RUN npm run build               # → /app/dist

#########################################################
# СТАДИЯ 2 — Запуск. Отдаём статику через nginx         #
#########################################################
FROM nginx:stable-alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
# nginx внутри контейнера слушает 80 порт
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
