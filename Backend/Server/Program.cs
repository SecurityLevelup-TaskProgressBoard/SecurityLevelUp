using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Server.Context;
using Server.Services;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;

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


			builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
				.AddJwtBearer(options =>
				{
					options.Authority = builder.Configuration["Cognito:Authority"];
					options.Audience = builder.Configuration["Cognito:ClientId"];
					options.TokenValidationParameters = new TokenValidationParameters
					{
						ValidateIssuer = true,
						ValidIssuer = builder.Configuration["Cognito:Authority"],
						ValidateAudience = true,
						ValidAudience = builder.Configuration["Cognito:ClientId"],
						ValidateIssuerSigningKey = true,
						IssuerSigningKeyResolver = (token, securityToken, kid, parameters) =>
						{
							// Fetch the JSON Web Key Set (JWKS) from the authority and find the matching key.
							var jwks = GetJsonWebKeySetAsync(builder.Configuration["Cognito:Authority"]).GetAwaiter().GetResult();
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

			app.UseHttpsRedirection();

            app.UseAuthentication(); // Ensure this comes before UseAuthorization
            app.UseAuthorization();
            app.UseCors();
			app.UseCors("AllowSpecificOrigin");

			app.MapControllers();

			app.Run();

            async Task<JsonWebKeySet> GetJsonWebKeySetAsync(string authority)
            {
                using (var httpClient = new HttpClient())
                {
                    var response = await httpClient.GetStringAsync($"{authority}/.well-known/jwks.json");
                    return new JsonWebKeySet(response);
                }
            }

        }
    }
}
