using HandyBrosApi.Models;
using Microsoft.EntityFrameworkCore;

namespace HandyBrosApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<Job> Jobs => Set<Job>();
        public DbSet<JobInterest> JobInterests => Set<JobInterest>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<JobInterest>()
                .HasKey(ji => new { ji.JobId, ji.UserId });
        }
    }
}