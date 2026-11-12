using Microsoft.AspNetCore.Http;
using ClinicManagement.Application.Interfaces.Identity;
using System.Security.Claims;

namespace ClinicManagement.Infrastructure.Implementations.Identity
{
    public class CurrentUserService : ICurrentUserService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CurrentUserService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public string? GetEmail()
            => _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.Name);

        public string? GetUserId()
            => _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);

        public string? GetRole()
            => _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.Role);
    }
}
