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

namespace PetApi.Controllers;

[ApiController]
[Route("auth")]
public class AuthController(AppDbContext db, IConfiguration cfg) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] Credentials dto)
    {
        if (await db.Users.AnyAsync(u => u.Username == dto.Username))
            return Conflict(new { error = "User exists" });

        CreatePasswordHash(dto.Password, out var hash, out var salt);
        var user = new User { Username = dto.Username, PasswordHash = hash, PasswordSalt = salt };
        db.Add(user);
        await db.SaveChangesAsync();
        return Ok();
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] Credentials dto)
    {
        var user = await db.Users.SingleOrDefaultAsync(u => u.Username == dto.Username);
        if (user is null || !Verify(dto.Password, user.PasswordHash, user.PasswordSalt))
            return Unauthorized();
        var token = GenerateToken(user);
        return Ok(new { token });
    }

    #region helpers
    private string GenerateToken(User user)
    {
        var creds = new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(cfg["Jwt:Key"]!)),
            SecurityAlgorithms.HmacSha256);

        var claims = new[] { new Claim(ClaimTypes.Name, user.Username) };
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
    #endregion
}