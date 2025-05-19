using Microsoft.EntityFrameworkCore;
using PetApi.Models;

namespace PetApi.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
}