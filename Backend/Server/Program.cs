using Microsoft.EntityFrameworkCore;
using Server.Context;
using Server.Services;

namespace Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowSpecificOrigin",
                    policyBuilder => policyBuilder
                        .WithOrigins("http://localhost:5500") //https://taskify.phipson.co.za
                        .AllowAnyHeader()
                        .AllowAnyMethod());
            });

            builder.Services.AddControllers();

            builder.Services.AddScoped<IProgressBoardService, ProgressBoardService>();

            var connectionString = Environment.GetEnvironmentVariable("DB_CONNECTION_STRING")
                                   ?? builder.Configuration.GetConnectionString("Default");
            builder.Services.AddDbContext<TaskProgressDBContext>(options =>
                options.UseSqlServer(connectionString));

            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.WebHost.ConfigureKestrel(serverOptions =>
            {
                serverOptions.ListenAnyIP(5000);
            });

            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();
            app.UseAuthorization();
            app.UseCors("AllowSpecificOrigin");

            app.MapControllers();

            app.Run();
        }
    }
}
