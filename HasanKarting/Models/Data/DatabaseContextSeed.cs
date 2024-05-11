using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace api.Models.Data
{
    public class DatabaseContextSeed
    {
        public static async Task SeedAsync(DatabaseContext databaseContext, UserManager<IdentityUser<int>> userManager, RoleManager<IdentityRole<int>> roleManager)
        {
            if (databaseContext.Database.IsNpgsql())
            {
                databaseContext.Database.Migrate();
            }

            await roleManager.CreateAsync(new IdentityRole<int>("Administrator"));
            await roleManager.CreateAsync(new IdentityRole<int>("Racer"));

            await userManager.CreateAsync(new User { UserName = "CharlesLeclerc", Email = "CharlesLeclerc@example.com" }, "CharlesLeclerc1!");
            await userManager.CreateAsync(new User { UserName = "CarlosSainz", Email = "CarlosSainz@example.com" }, "CarlosSainz1!");
            await userManager.CreateAsync(new User { UserName = "MaxVerstappen", Email = "MaxVerstappen@example.com" }, "MaxVerstappen1!");
            await userManager.CreateAsync(new User { UserName = "SergioPerez", Email = "SergioPerez@example.com" }, "SergioPerez1!");
            await userManager.CreateAsync(new User { UserName = "LandoNorris", Email = "LandoNorris@example.com" }, "LandoNorris1!");
            await userManager.CreateAsync(new User { UserName = "OscarPiastri", Email = "OscarPiastri@example.com" }, "OscarPiastri1!");
            await userManager.CreateAsync(new User { UserName = "FernandoAlonso", Email = "FernandoAlonso@example.com" }, "FernandoAlonso1!");
            await userManager.CreateAsync(new User { UserName = "LanceStroll", Email = "LanceStroll@example.com" }, "LanceStroll1!");
            await userManager.CreateAsync(new User { UserName = "LewisHamilton", Email = "LewisHamilton@example.com" }, "LewisHamilton1!");
            await userManager.CreateAsync(new User { UserName = "GeorgeRussel", Email = "GeorgeRussel@example.com" }, "GeorgeRussel1!");
            var racers = new List<string> { "CharlesLeclerc", "CarlosSainz", "MaxVerstappen", "SergioPerez", "LandoNorris", "OscarPiastri", "FernandoAlonso", "LanceStroll", "LewisHamilton", "GeorgeRussel" };

            foreach (var racer in racers)
            {
                var user = await userManager.FindByNameAsync(racer);
                if (user != null)
                    await userManager.AddToRoleAsync(user, "Racer");
            }

            await userManager.CreateAsync(new User { UserName = "NielsWittich", Email = "NielsWittich@microsoft.com" }, "NielsWittich1!");
            var admin = await userManager.FindByNameAsync("NielsWittich");
            if (admin != null)
                await userManager.AddToRoleAsync(admin, "Administrator");

            try
            {
                databaseContext.Database.EnsureCreated();

                if (databaseContext.Cars.Any() == false)
                {
                    var cars = new Car[]
                    {
                        new Car
                        {
                            Manufacturer = "Scuderia Ferrari",
                            Model = "SF-24 (1)",
                            Power = 1150,
                            Mileage = 12423,
                            Weight = 835,
                        },
                        new Car
                        {
                            Manufacturer = "Scuderia Ferrari",
                            Model = "SF-24 (2)",
                            Power = 1150,
                            Mileage = 12423,
                            Weight = 835,
                        },
                        new Car
                        {
                            Manufacturer = "Red Bull",
                            Model = "RB20 (1)",
                            Power = 1130,
                            Mileage = 16029,
                            Weight = 830,
                        },
                        new Car
                        {
                            Manufacturer = "Red Bull",
                            Model = "RB20 (2)",
                            Power = 1130,
                            Mileage = 16029,
                            Weight = 830,
                        },
                        new Car
                        {
                            Manufacturer = "McLaren",
                            Model = "MCL38 (1)",
                            Power = 1110,
                            Mileage = 15872,
                            Weight = 832,
                        },
                        new Car
                        {
                            Manufacturer = "McLaren",
                            Model = "MCL38 (2)",
                            Power = 1110,
                            Mileage = 15872,
                            Weight = 832,
                        },
                        new Car
                        {
                            Manufacturer = "Aston Martin",
                            Model = "AMR24 (1)",
                            Power = 1100,
                            Mileage = 9613,
                            Weight = 835,
                        },

                        new Car
                        {
                            Manufacturer = "Aston Martin",
                            Model = "AMR24 (2)",
                            Power = 1100,
                            Mileage = 9613,
                            Weight = 835,
                        },
                        new Car
                        {
                            Manufacturer = "Mercedes",
                            Model = "W15 (1)",
                            Power = 1100,
                            Mileage = 11659,
                            Weight = 830,
                        },
                        new Car
                        {
                            Manufacturer = "Mercedes",
                            Model = "W15 (2)",
                            Power = 1100,
                            Mileage = 11659,
                            Weight = 830,
                        },
                    };

                    foreach (Car item in cars)
                        databaseContext.Cars.Add(item);
                    await databaseContext.SaveChangesAsync();
                }
                if (databaseContext.Races.Any() == false)
                {
                    var races = new Race[]
                    {

                       new Race { Date = DateTime.SpecifyKind(new DateTime(2024, 1, 20), DateTimeKind.Utc) },
                        new Race { Date = DateTime.SpecifyKind(new DateTime(2024, 2, 10), DateTimeKind.Utc) },
                        new Race { Date = DateTime.SpecifyKind(new DateTime(2024, 7, 15), DateTimeKind.Utc) },
                        new Race { Date = DateTime.SpecifyKind(new DateTime(2024, 8, 5), DateTimeKind.Utc) },
                        new Race { Date = DateTime.SpecifyKind(new DateTime(2024, 9, 25), DateTimeKind.Utc) },
                    };

                    foreach (Race item in races)
                        databaseContext.Races.Add(item);
                    await databaseContext.SaveChangesAsync();
                }
                if (databaseContext.Protocols.Any() == false)
                {
                    var protocols = new Protocol[]
                    {
                         new Protocol { RaceId = 1, UserId = 1, CarId = 1, CompletionTime = new TimeOnly(0, 53, 32, 125) },
                         new Protocol { RaceId = 1, UserId = 2, CarId = 2, CompletionTime = new TimeOnly(0, 53, 31, 329) },
                         new Protocol { RaceId = 1, UserId = 3, CarId = 3, CompletionTime = new TimeOnly(0, 53, 55, 843) },
                         new Protocol { RaceId = 1, UserId = 4, CarId = 4, CompletionTime = new TimeOnly(0, 53, 44, 009) },
                         new Protocol { RaceId = 1, UserId = 5, CarId = 5, CompletionTime = new TimeOnly(0, 54, 00, 238) },

                         new Protocol { RaceId = 2, UserId = 6, CarId = 6, CompletionTime = new TimeOnly(0, 52, 59, 998) },
                         new Protocol { RaceId = 2, UserId = 7, CarId = 7, CompletionTime = new TimeOnly(0, 52, 55, 234) },
                         new Protocol { RaceId = 2, UserId = 8, CarId = 8, CompletionTime = new TimeOnly(0, 52, 51, 093) },
                         new Protocol { RaceId = 2, UserId = 9, CarId = 9, CompletionTime = new TimeOnly(0, 53, 10, 021) },
                         new Protocol { RaceId = 2, UserId = 10, CarId = 10, CompletionTime = new TimeOnly(0, 53, 15, 832) },

                         new Protocol { RaceId = 3, UserId = 1, CarId = 1, CompletionTime = null },
                         new Protocol { RaceId = 3, UserId = 3, CarId = 3, CompletionTime = null },
                         new Protocol { RaceId = 3, UserId = 5, CarId = 5, CompletionTime = null },
                         new Protocol { RaceId = 3, UserId = 7, CarId = 7, CompletionTime = null },
                         new Protocol { RaceId = 3, UserId = 9, CarId = 9, CompletionTime = null },
                    };

                    foreach (Protocol item in protocols)
                        databaseContext.Protocols.Add(item);
                    await databaseContext.SaveChangesAsync();
                }
            }
            catch
            {
                throw;
            }
        }
    }
}
