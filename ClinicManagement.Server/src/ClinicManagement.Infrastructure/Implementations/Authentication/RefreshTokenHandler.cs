using MayNghien.Infrastructures.Models.Responses;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using ClinicManagement.Application.Interfaces.Authentication;
using ClinicManagement.Application.Interfaces.Repositories;
using ClinicManagement.DTOs.Authentication.Responses;
using ClinicManagement.Infrastructure.Persistence.Entities;

namespace ClinicManagement.Infrastructure.Implementations.Authentication
{
    public class RefreshTokenHandler : IRefreshTokenHandler
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _config;
        private readonly IRefreshTokenRepository _refreshTokenRepository;

        public RefreshTokenHandler(
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

        public async Task<AppResponse<RefreshTokenResponse>> HandleAsync(string refreshToken)
        {
            var result = new AppResponse<RefreshTokenResponse>();

            var tokenEntity = await _refreshTokenRepository.FindByTokenAsync(refreshToken);

            if (tokenEntity == null)
                return result.BuildError("Invalid refresh token.");

            if (tokenEntity.IsRevoked)
                return result.BuildError("Refresh token has been revoked.");

            if (tokenEntity.RefreshTokenExpiryTime < DateTime.UtcNow)
                return result.BuildError("Refresh token has expired.");

            var user = await _userManager.FindByIdAsync(tokenEntity.UserId.ToString()!);
            if (user == null)
                return result.BuildError("User not found.");

            tokenEntity.IsRevoked = true;
            await _refreshTokenRepository.EditAsync(tokenEntity);

            var roles = await _userManager.GetRolesAsync(user);
            var claims = LoginHandler.BuildClaims(user.Id, user.Email!, user.PhoneNumber, roles);

            var loginHandler = new LoginHandler(_userManager, _roleManager, _config, _refreshTokenRepository);
            var (newAccessToken, newRefreshToken) = await loginHandler.GenerateTokensAsync(user, claims);

            return result.BuildResult(new RefreshTokenResponse
            {
                Name = user.UserName!,
                Email = user.Email!,
                PhoneNumber = user.PhoneNumber!,
                Token = newAccessToken,
                RefreshToken = newRefreshToken,
            });
        }
    }
}
