using System.Text;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using Serilog.Context;
using Serilog.Formatting.Compact;

using PetApi.Data;
using PetApi.Models;
using Serilog.Sinks.Grafana.Loki;


var builder = WebApplication.CreateBuilder(args);

// builder.Logging.ClearProviders();

// Log.Logger = new LoggerConfiguration()
//     .Enrich.FromLogContext()
//     // .WriteTo.Console(new RenderedCompactJsonFormatter())
//     .WriteTo.Console()
//     .CreateLogger();


var user = new User { Id = 1, Username = "testuser" }; // Example user for logging
using (LogContext.PushProperty("UserId", user))
{
  Log.Information("User is here!!!!!!!!!!!!!!");
}

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    });
});
builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseNpgsql(builder.Configuration.GetConnectionString("Default")));
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = false,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });
builder.Services.AddAuthorization();

// builder.Host.UseSerilog();

// Конфигурируем Serilog через делегат
builder.Host.UseSerilog((ctx, lc) => lc
    // Настройки из appsettings*.json
    .ReadFrom.Configuration(ctx.Configuration)
    // Базовые обогащения
    .Enrich.FromLogContext()
    .Enrich.WithEnvironmentUserName()
    .Enrich.WithMachineName()
    // Вывод в stdout в компактном JSON‑формате (собирается Fluent Bit)
    .WriteTo.Console(new RenderedCompactJsonFormatter())
    .Enrich.WithProperty("source", "serilog")
    // Прямая отправка в Loki
    .WriteTo.GrafanaLoki(
        // uri: ctx.Configuration["LOKI_URL"],
        // uri: ctx.Configuration["LOKI_URL"],
        uri: "http://localhost:3100/loki/api/v1/push",
        credentials: new LokiCredentials
        {
          // Login = ctx.Configuration["LOKI_USER"],
          // Password = ctx.Configuration["LOKI_PASSWORD"]
          Login = "admin",
          Password = "admin"

        }));
        
builder.WebHost.UseUrls("http://0.0.0.0:5000");

var app = builder.Build();

// ⬇⬇⬇ Автоматическое применение миграций при старте
using (var scope = app.Services.CreateScope())
{
  var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
  db.Database.Migrate();
}

if (app.Environment.IsDevelopment() || app.Environment.IsProduction() || app.Environment.EnvironmentName == "local")
{
  app.UseSwagger();
  app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Pet API v1"));
}

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.UseSerilogRequestLogging();
app.Run();
// app.MapGet("/health", () => Results.Ok("Backend is working"));