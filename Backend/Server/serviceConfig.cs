namespace Server
{
    public class serviceConfig
    {
        public void ConfigureServices(IServiceCollection services, IConfiguration Configuration)
        {
            services.AddControllers();
            services.AddSingleton<JwtTokenValidator>();

            // Configure authentication middleware

        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();
            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
