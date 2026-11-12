using MayNghien.Infrastructures.Helpers;
using MayNghien.Infrastructures.Models.Responses;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using ClinicManagement.Application.Interfaces.Authentication;
using ClinicManagement.DTOs.Authentication.Responses;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ClinicManagement.Infrastructure.Implementations.Authentication
{
    public class GetProfileHandler : IGetProfileHandler
    {
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly IConfiguration _config;

        public GetProfileHandler(IHttpContextAccessor contextAccessor, IConfiguration config)
        {
            _contextAccessor = contextAccessor;
            _config = config;
        }

        public Task<AppResponse<ProfileResponse>> HandleAsync()
        {
            var result = new AppResponse<ProfileResponse>();

            var context = _contextAccessor.HttpContext;
            if (context == null)
                return Task.FromResult(result.BuildError("Missing http context."));

            var token = ClaimHelper.GetTokenFromHeader(context) ?? context.Request.Cookies["AuthToken"];
            if (string.IsNullOrWhiteSpace(token))
                return Task.FromResult(result.BuildError("Missing access token."));

            var handler = new JwtSecurityTokenHandler();
            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ClockSkew = TimeSpan.Zero,
                ValidIssuer = _config["Jwt:Issuer"],
                ValidAudience = _config["Jwt:Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(_config["Jwt:Key"] ?? string.Empty))
            };

            SecurityToken validatedToken;
            ClaimsPrincipal principal;
            try
            {
                principal = handler.ValidateToken(token, validationParameters, out validatedToken);
            }
            catch (SecurityTokenException)
            {
                return Task.FromResult(result.BuildError("Invalid or expired access token."));
            }

            var role = principal.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value ?? string.Empty;
            var name = principal.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value ?? string.Empty;
            var phoneNumber = principal.Claims.FirstOrDefault(c => c.Type == ClaimTypes.MobilePhone)?.Value;

            return Task.FromResult(result.BuildResult(new ProfileResponse
            {
                UserName = name,
                Role = role,
                PhoneNumber = phoneNumber,
            }));
        }
    }
}
