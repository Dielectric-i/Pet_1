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


var builder = WebApplication.CreateBuilder(args);

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


// Конфигурируем Serilog через делегат
builder.Host.UseSerilog((ctx, lc) => lc.MinimumLevel.Override("Microsoft", Serilog.Events.LogEventLevel.Warning)
    // Настройки из appsettings*.json
    // .ReadFrom.Configuration(ctx.Configuration)
    .Enrich.FromLogContext()
    // .Enrich.WithEnvironmentUserName()
    // .Enrich.WithMachineName()
    // .Enrich.WithProperty("source", "serilog")
    .WriteTo.Console(new RenderedCompactJsonFormatter())
  );
        
builder.WebHost.UseUrls("http://0.0.0.0:5000");

var app = builder.Build();

// ⬇⬇⬇ Автоматическое применение миграций при старте
using (var scope = app.Services.CreateScope())
{
  var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
  db.Database.Migrate();
}

// if (app.Environment.IsDevelopment() || app.Environment.IsProduction() || app.Environment.EnvironmentName == "local")
// {
//   app.UseSwagger();
//   app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Pet API v1"));
// }

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.UseSerilogRequestLogging();
app.Run();