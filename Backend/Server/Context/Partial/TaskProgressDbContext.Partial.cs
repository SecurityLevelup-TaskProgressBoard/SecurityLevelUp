using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace Server.Context
{
	public partial class TaskProgressDbContext : DbContext
	{
		private void RegisterDb(DbContextOptionsBuilder optionsBuilder, int retryCount=3)
		{
			try
			{
				IConfiguration configuration = new ConfigurationBuilder()
													.AddJsonFile("appsettings.json")
													.Build();
				string connectionString = configuration.GetConnectionString("TPBDBConnection");

				optionsBuilder.UseSqlServer(connectionString);
			} catch(Exception)
			{
				if (retryCount > 0)
				{
					RegisterDb(optionsBuilder, retryCount-1);
				} else
				{
					throw new Exception("Error reading connectionstring");
				}
			}
			
		}
	}
}
