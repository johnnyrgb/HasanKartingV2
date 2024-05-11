using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;

namespace api.Models.Data
{
    public partial class DatabaseContext : IdentityDbContext<IdentityUser<int>, IdentityRole<int>, int>
    {
        protected readonly IConfiguration _configuration;
        public DatabaseContext(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql(_configuration.GetConnectionString("HasanKarting"));
        }

        public DbSet<Car> Cars { get; set; }
        public DbSet<Race> Races { get; set; }
        public DbSet<Protocol> Protocols { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<Car>(c =>
            {

                // Первичный ключ
                c.HasKey(c => c.Id);

                // Все поля не nullable
                c.Property(c => c.Id).IsRequired();
                c.Property(c => c.Manufacturer).IsRequired();
                c.Property(c => c.Model).IsRequired();
                c.Property(c => c.Power).IsRequired();
                c.Property(c => c.Mileage).IsRequired();
                c.Property(c => c.Weight).IsRequired();

                c.HasMany(c => c.Protocols)
                 .WithOne()
                 .IsRequired();

            });
            builder.Entity<Race>(r =>
            {
                // Первичный ключ
                r.HasKey(r => r.Id);

                // Все поля не nullable
                r.Property(r => r.Id).IsRequired();
                r.Property(r => r.Date).IsRequired();
                r.Property(r => r.Date).HasColumnType("timestamp with time zone");
                r.HasMany(r => r.Protocols)
                 .WithOne()
                 .IsRequired();
            });
            builder.Entity<Protocol>(p =>
            {
                // Первичный ключ
                p.HasKey(p => p.Id);

                // Внешние ключи
                p.HasOne(p => p.Race)
                       .WithMany(r => r.Protocols)
                       .HasForeignKey(p => p.RaceId)
                       .IsRequired();

                p.HasOne(p => p.User)
                       .WithMany(u => u.Protocols)
                       .HasForeignKey(p => p.UserId)
                       .IsRequired();

                p.HasOne(p => p.Car)
                       .WithMany(c => c.Protocols)
                       .HasForeignKey(p => p.CarId)
                       .IsRequired();

                // CompletionTime - nullable
                p.Property(p => p.CompletionTime).IsRequired(false);
                p.Property(p => p.CompletionTime).HasColumnType("time");
            });
        }
    }
}
