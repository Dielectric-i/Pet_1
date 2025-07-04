#########################################################
# СТАДИЯ 1 — Сборка .NET‑приложения                     #
#########################################################
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Копируем только файл csproj для ускорения layer‑кэширования
COPY backend.csproj ./
RUN dotnet restore ./backend.csproj

# Копируем весь код проекта
COPY . .

# Публикуем приложение в папку /app/publish (Release‑сборка)
RUN dotnet publish -c Release -o /app/publish

#########################################################
# СТАДИЯ 2 — Runtime                                    #
#########################################################
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .


ENTRYPOINT ["dotnet", "backend.dll"]
