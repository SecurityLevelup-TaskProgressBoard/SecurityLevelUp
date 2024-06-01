using Microsoft.EntityFrameworkCore;

namespace Server.Context
{
	public partial class TaskProgressDBContext : DbContext
	{
		private static readonly ILoggerFactory _loggerFactory = LoggerFactory.Create(builder =>
		{
			builder
				.AddConsole()
				.AddFilter((category, level) =>
					category == DbLoggerCategory.Database.Command.Name && level == LogLevel.Warning);
		});

		private void RegisterDb(DbContextOptionsBuilder optionsBuilder, int retryCount = 3)
		{
			try
			{
				IConfiguration configuration = new ConfigurationBuilder()
													.AddJsonFile("appsettings.json")
													.Build();
				string connectionString = configuration.GetConnectionString("TPBDBConnection");
				optionsBuilder.UseLoggerFactory(_loggerFactory)
								.UseSqlServer(connectionString);
			}
			catch(Exception)
			{
				if(retryCount > 0)
				{
					RegisterDb(optionsBuilder, retryCount - 1);
				}
				else
				{
					throw new Exception("Error reading connectionstring");
				}
			}

		}
	}
}
