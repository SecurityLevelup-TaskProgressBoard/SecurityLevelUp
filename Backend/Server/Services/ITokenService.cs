using System.Security.Claims;

namespace Server.Services
{
    public interface ITokenService
    {
        string GetEmail(ClaimsPrincipal user);
    }
}
