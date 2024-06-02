using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;

namespace Server
{
    public class JwtTokenValidator
    {
        private readonly IConfiguration _configuration;
        private readonly TokenValidationParameters _tokenValidationParameters;

        public JwtTokenValidator(IConfiguration configuration)
        {
            _configuration = configuration;

            var authority = Environment.GetEnvironmentVariable("Cognito_Authority");//_configuration["Cognito:Authority"];
            var clientId = Environment.GetEnvironmentVariable("Cognito_ClientId");//_configuration["Cognito:ClientId"];
            var userPoolId = Environment.GetEnvironmentVariable("Cognito_UserPoolId"); //_configuration["Cognito:UserPoolId"];

            _tokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidIssuer = authority,

                ValidateAudience = true,
                ValidAudience = clientId,

                ValidateIssuerSigningKey = true,
                IssuerSigningKeyResolver = (token, securityToken, kid, validationParameters) =>
                {
                    // Fetch the JSON Web Key Set (JWKS) from the authority and find the matching key.
                    var jwks = GetJsonWebKeySetAsync(authority).GetAwaiter().GetResult();
                    return jwks.Keys.Where(k => k.KeyId == kid);
                },

                ValidateLifetime = true
            };
        }

        public async Task<JwtSecurityToken> ValidateTokenAsync(string token)
        {
            var handler = new JwtSecurityTokenHandler();
            var principal = handler.ValidateToken(token, _tokenValidationParameters, out var securityToken);

            if (securityToken is JwtSecurityToken jwtSecurityToken &&
                jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.RsaSha256, StringComparison.InvariantCultureIgnoreCase))
            {
                Console.WriteLine("Token is valid");
                return jwtSecurityToken;
            }
            throw new SecurityTokenException("Invalid token");
        }

        private async Task<JsonWebKeySet> GetJsonWebKeySetAsync(string authority)
        {
            using (var httpClient = new HttpClient())
            {
                var response = await httpClient.GetStringAsync($"{authority}/.well-known/jwks.json");
                return new JsonWebKeySet(response);
            }
        }
    }
}
