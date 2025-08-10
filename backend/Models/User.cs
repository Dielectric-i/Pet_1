using System;

namespace PetApi.Models;

public class User
{
    public int Id { get; set; }
    public string userName { get; set; } = string.Empty;
    public byte[] PasswordHash { get; set; } = Array.Empty<byte>();
    public byte[] PasswordSalt { get; set; } = Array.Empty<byte>();
}