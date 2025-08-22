using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

using PetApi.Models;
using PetApi.Data;

using Microsoft.AspNetCore.Authorization;          // [Authorize]
// using System.Security.Claims;
using Microsoft.AspNetCore.Http;                      // ClaimsPrincipal

namespace PetApi.Controllers;

[ApiController]
[Route("auth")]
public class AuthController(AppDbContext db, IConfiguration cfg) : ControllerBase
{
  [HttpPost("register")]
  public async Task<IActionResult> Register([FromBody] Credentials dto)
  {
    if (await db.Users.AnyAsync(u => u.userName == dto.Username))
      return Conflict(new { error = "User exists" });
    CreatePasswordHash(dto.Password, out var hash, out var salt);
    var user = new User { userName = dto.Username, PasswordHash = hash, PasswordSalt = salt };
    db.Add(user);
    await db.SaveChangesAsync();
    return Ok();
  }


  [Authorize]
  [HttpGet("validate")]
  public IActionResult Validate()
  {
    // 3.1.1. Извлекаем имя пользователя из claim "name" (см. выдачу токена)
    var name = User.FindFirst("name")?.Value
               ?? User.Identity?.Name
               ?? "user";

    // 3.1.2. Кладём имя в заголовок ответа — Nginx прочитает его и прокинет в Grafana как X-WEBAUTH-USER
    Response.Headers.Append("X-User", name);

    // 3.1.3. Просто возвращаем 200 OK — факт, что [Authorize] пропустил, означает валидный JWT
    return Ok(new { ok = true });
  }
  [HttpPost("login")]
  public async Task<IActionResult> Login([FromBody] Credentials dto)
  {
    var user = await db.Users.SingleOrDefaultAsync(u => u.userName == dto.Username);
    if (user is null || !Verify(dto.Password, user.PasswordHash, user.PasswordSalt))
      return Unauthorized();
    var token = GenerateToken(user);
    return Ok(new { token });
  }

  private string GenerateToken(User user)
  {
    var creds = new SigningCredentials(
      new SymmetricSecurityKey(Encoding.UTF8.GetBytes(cfg["Jwt:Key"]!)),
      SecurityAlgorithms.HmacSha256);

    var claims = new[] { new Claim("name", user.userName) };
    var jwt = new JwtSecurityToken(
      issuer: cfg["Jwt:Issuer"],
      audience: null,
      claims: claims,
      expires: DateTime.UtcNow.AddHours(12),
      signingCredentials: creds);
    return new JwtSecurityTokenHandler().WriteToken(jwt);
  }

  private static void CreatePasswordHash(string password, out byte[] hash, out byte[] salt)
  {
    using var hmac = new HMACSHA512();
    salt = hmac.Key;
    hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
  }

  private static bool Verify(string password, byte[] hash, byte[] salt)
  {
    using var hmac = new HMACSHA512(salt);
    var comp = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
    return comp.SequenceEqual(hash);
  }

  public record Credentials(string Username, string Password);
}