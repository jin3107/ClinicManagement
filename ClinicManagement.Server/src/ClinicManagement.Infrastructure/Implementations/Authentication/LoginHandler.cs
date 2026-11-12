using MayNghien.Infrastructures.Models.Responses;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using ClinicManagement.Application.Interfaces.Authentication;
using ClinicManagement.Application.Interfaces.Repositories;
using ClinicManagement.Commons.Enum;
using ClinicManagement.Domain.Entities;
using ClinicManagement.DTOs.Authentication.Requests;
using ClinicManagement.DTOs.Authentication.Responses;
using ClinicManagement.Infrastructure.Persistence.Entities;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace ClinicManagement.Infrastructure.Implementations.Authentication
{
    public class LoginHandler : ILoginHandler
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _config;
        private readonly IRefreshTokenRepository _refreshTokenRepository;

        public LoginHandler(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            IConfiguration config,
            IRefreshTokenRepository refreshTokenRepository)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _config = config;
            _refreshTokenRepository = refreshTokenRepository;
        }

        public async Task<AppResponse<LoginResponse>> HandleAsync(LoginRequest request)
        {
            var result = new AppResponse<LoginResponse>();

            var user = await _userManager.FindByNameAsync(request.UserName)
                ?? await _userManager.FindByEmailAsync(request.UserName);

            var seedEmail = _config["Seed:AdminEmail"];
            var seedPassword = _config["Seed:AdminPassword"];

            if (user == null && !string.IsNullOrWhiteSpace(seedEmail) && !string.IsNullOrWhiteSpace(seedPassword)
                && string.Equals(request.UserName, seedEmail, StringComparison.OrdinalIgnoreCase))
            {
                user = await SeedAdminAsync(seedEmail, seedPassword);
            }

            if (user == null)
                return result.BuildError("User not found. Please check your username or email.");

            if (!await _userManager.CheckPasswordAsync(user, request.Password))
                return result.BuildError("Invalid credentials. Please check your password.");

            var roles = await _userManager.GetRolesAsync(user);
            if (!roles.Any())
                return result.BuildError("User has no role assigned.");

            var claims = BuildClaims(user.Email!, user.PhoneNumber, roles);
            var (accessToken, refreshToken) = await GenerateTokensAsync(user, claims);

            return result.BuildResult(new LoginResponse
            {
                UserName = user.UserName!,
                Email = user.Email!,
                PhoneNumber = user.PhoneNumber!,
                Role = roles.First(),
                AccessToken = accessToken,
                RefreshToken = refreshToken,
            });
        }

        private async Task<ApplicationUser?> SeedAdminAsync(string email, string password)
        {
            // A previous seed attempt may have already created the user (e.g. this ran
            // on an earlier login that failed later, or two requests raced). Re-check
            // before creating again instead of blindly retrying CreateAsync.
            var existing = await _userManager.FindByEmailAsync(email);
            if (existing != null) return existing;

            var admin = new ApplicationUser
            {
                Email = email,
                EmailConfirmed = true,
                UserName = email,
                Role = Role.SuperAdmin,
            };

            var createResult = await _userManager.CreateAsync(admin, password);
            if (!createResult.Succeeded)
            {
                // Someone else created it concurrently between the check above and here.
                return await _userManager.FindByEmailAsync(email);
            }

            if (!await _roleManager.RoleExistsAsync("SuperAdmin"))
                await _roleManager.CreateAsync(new IdentityRole("SuperAdmin"));

            await _userManager.AddToRoleAsync(admin, "SuperAdmin");
            return admin;
        }

        internal static List<Claim> BuildClaims(string email, string? phoneNumber, IList<string> roles)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Email, email),
                new Claim(ClaimTypes.Name, email),
            };
            if (!string.IsNullOrWhiteSpace(phoneNumber))
                claims.Add(new Claim(ClaimTypes.MobilePhone, phoneNumber));
            foreach (var role in roles)
                claims.Add(new Claim(ClaimTypes.Role, role));
            return claims;
        }

        internal async Task<(string accessToken, string refreshToken)> GenerateTokensAsync(
            ApplicationUser user, IEnumerable<Claim> claims)
        {
            var accessToken = GenerateAccessToken(claims);
            var refreshToken = GenerateRefreshToken();

            await _refreshTokenRepository.AddAsync(new RefreshTokenModel
            {
                UserId = Guid.Parse(user.Id),
                RefreshToken = refreshToken,
                RefreshTokenExpiryTime = DateTime.UtcNow.AddMinutes(
                    int.Parse(_config["Jwt:RefreshTokenExpiresIn"] ?? "10080")),
                IsRevoked = false,
                CreatedOn = DateTime.UtcNow,
                CreatedBy = user.Email
            });

            return (accessToken, refreshToken);
        }

        private string GenerateAccessToken(IEnumerable<Claim> claims)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddSeconds(
                    int.Parse(_config["Jwt:AccessTokenExpiresIn"] ?? "3600")),
                signingCredentials: credentials);
            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private static string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }
    }
}
