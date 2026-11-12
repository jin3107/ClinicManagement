using MayNghien.Infrastructures.Models.Responses;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using ClinicManagement.Application.Interfaces.Authentication;
using ClinicManagement.Application.Interfaces.Repositories;
using ClinicManagement.Commons.Enum;
using ClinicManagement.DTOs.Authentication.Requests;
using ClinicManagement.DTOs.Authentication.Responses;
using ClinicManagement.Infrastructure.Persistence.Entities;

namespace ClinicManagement.Infrastructure.Implementations.Authentication
{
    public class RegisterHandler : IRegisterHandler
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _config;
        private readonly IRefreshTokenRepository _refreshTokenRepository;

        public RegisterHandler(
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

        public async Task<AppResponse<RegisterResponse>> HandleAsync(RegisterRequest request)
        {
            var result = new AppResponse<RegisterResponse>();

            if (await _userManager.FindByEmailAsync(request.Email) != null
                || _userManager.Users.Any(u => u.PhoneNumber == request.PhoneNumber))
                return result.BuildError("User already exists.");

            var user = new ApplicationUser
            {
                UserName = request.Email,
                Email = request.Email,
                EmailConfirmed = true,
                SecurityStamp = Guid.NewGuid().ToString(),
                PhoneNumber = request.PhoneNumber,
                Role = Role.BenhNhan
            };

            var createResult = await _userManager.CreateAsync(user, request.Password);
            if (!createResult.Succeeded)
                return result.BuildError(string.Join(", ", createResult.Errors.Select(e => e.Description)));

            if (!await _roleManager.RoleExistsAsync("BenhNhan"))
                await _roleManager.CreateAsync(new IdentityRole("BenhNhan"));
            await _userManager.AddToRoleAsync(user, "BenhNhan");

            var roles = await _userManager.GetRolesAsync(user);
            var claims = LoginHandler.BuildClaims(user.Id, user.Email!, user.PhoneNumber, roles);

            var loginHandler = new LoginHandler(_userManager, _roleManager, _config, _refreshTokenRepository);
            var (accessToken, refreshToken) = await loginHandler.GenerateTokensAsync(user, claims);

            return result.BuildResult(new RegisterResponse
            {
                Email = request.Email,
                Name = request.Name,
                PhoneNumber = request.PhoneNumber,
                Role = roles.FirstOrDefault() ?? "BenhNhan",
                AccessToken = accessToken,
                RefreshToken = refreshToken,
            }, "Patient registered successfully!");
        }
    }
}
