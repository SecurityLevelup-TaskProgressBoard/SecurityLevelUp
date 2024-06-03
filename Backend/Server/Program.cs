using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Server.Context;
using Server.Services;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.Extensions.Options;

namespace Server
{
	public class Program
	{
		private static readonly ILoggerFactory _loggerFactory = LoggerFactory.Create(builder =>
		{
			builder
			.AddConsole()
			.AddFilter((category, level) =>
			category == DbLoggerCategory.Database.Command.Name && level >= LogLevel.Warning);
		});
		public static void Main(string[] args)
		{
			var builder = WebApplication.CreateBuilder(args);

			builder.Services.AddCors(options =>
			{
				options.AddPolicy("AllowSpecificOrigin",
					policyBuilder => policyBuilder
						.WithOrigins("http://localhost:5500", "http://127.0.0.1:5500", "http://localhost:5500", "http://localhost:5500/", "https://taskify.phipson.co.za") // TODO REMOVE whats not needed
						.AllowAnyHeader()
						.AllowAnyMethod());
			});

			builder.Services.AddControllers();

			builder.Services.AddScoped<IProgressBoardService, ProgressBoardService>();

			var connectionString = Environment.GetEnvironmentVariable("DB_CONNECTION_STRING");

			builder.Services.AddDbContext<TaskProgressDBContext>(options =>
				options.UseLoggerFactory(_loggerFactory).UseSqlServer(connectionString));

			builder.Services.AddEndpointsApiExplorer();
			builder.Services.AddSwaggerGen();
			builder.Services.AddScoped<ITokenService, TokenService>();


			builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
				.AddJwtBearer(options =>
				{
					options.Authority = Environment.GetEnvironmentVariable("Cognito_Authority");

					options.Audience = Environment.GetEnvironmentVariable("Cognito_ClientId");

					options.TokenValidationParameters = new TokenValidationParameters
					{
						ValidateIssuer = true,
						ValidIssuer = Environment.GetEnvironmentVariable("Cognito_Authority"),

						ValidateAudience = true,
						ValidAudience = Environment.GetEnvironmentVariable("Cognito_ClientId"),

						ValidateIssuerSigningKey = true,
						IssuerSigningKeyResolver = (token, securityToken, kid, parameters) =>
						{
							// Fetch the JSON Web Key Set (JWKS) from the authority and find the matching key.
							var jwks = GetJsonWebKeySetAsync().GetAwaiter().GetResult();
							return jwks.Keys.Where(k => k.KeyId == kid);
						},
						ValidateLifetime = true
					};
				});

			var app = builder.Build();

			if (app.Environment.IsDevelopment())
			{
				app.UseSwagger();
				app.UseSwaggerUI();
			}

			// app.UseHttpsRedirection(); // dont need this because HTTP comms between ec2 and CF -- CF https --> end user
			app.UseCors();
			app.UseCors("AllowSpecificOrigin");
			app.UseAuthentication(); // Ensure this comes before UseAuthorization
			app.UseAuthorization();


			app.MapControllers();

			app.Run();

			async Task<JsonWebKeySet> GetJsonWebKeySetAsync()
			{
				var authority = Environment.GetEnvironmentVariable("Cognito_Authority");
				using (var httpClient = new HttpClient())
				{
					var response = await httpClient.GetStringAsync($"{authority}/.well-known/jwks.json");
					return new JsonWebKeySet(response);
				}
			}

		}
	}
}