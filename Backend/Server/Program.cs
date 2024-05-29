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
					builder => builder
						.WithOrigins("http://127.0.0.1:5500") // Replace with your frontend URL
						.AllowAnyHeader()
						.AllowAnyMethod());
			});

			builder.Services.AddControllers();

			builder.Services.AddScoped<IProgressBoardService, ProgressBoardService>();
			builder.Services.AddDbContext<TaskProgressDBContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("Default")));

			builder.Services.AddEndpointsApiExplorer();
			builder.Services.AddSwaggerGen();

			var app = builder.Build();

			if(app.Environment.IsDevelopment())
			{
				app.UseSwagger();
				app.UseSwaggerUI();
			}

			app.UseHttpsRedirection();

			app.UseAuthorization();
			app.UseCors();
			app.UseCors("AllowSpecificOrigin");

			app.MapControllers();

			app.Run();
		}
	}
}
