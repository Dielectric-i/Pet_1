# === СТАДИЯ 1: сборка (build) ===
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
# Рабочая папка внутри контейнера
WORKDIR /src
# Копируем только файл csproj для ускорения layer‑кэширования
COPY /backend.csproj ./
# Восстанавливаем зависимости NuGet
RUN dotnet restore ./backend.csproj
# Копируем весь код проекта
COPY . .
# Публикуем приложение в папку /app/publish (Release‑сборка)
RUN dotnet publish -c Release -o /app/publish

# === СТАДИЯ 2: runtime ===
# Берём лёгкий runtime‑образ без SDK
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
# Копируем из стадии build готовые dll и прочие артефакты
COPY --from=build /app/publish .
# гарантируем порт
ENV ASPNETCORE_URLS=http://0.0.0.0:5000
# Указываем, что контейнер слушает порт 5000
EXPOSE 5000
# Точка входа: запускаем приложение
ENTRYPOINT ["dotnet", "backend.dll"]
