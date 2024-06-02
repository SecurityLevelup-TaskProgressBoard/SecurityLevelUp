using System.Security.Claims;

namespace Server.Services
{
    public class TokenService : ITokenService
    {
        public string GetEmail(ClaimsPrincipal user)
        {
            // Retrieve the email claim from the token
            var emailClaim = user.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;

            return emailClaim ?? "Email claim not found in token.";
        }
    }
}
