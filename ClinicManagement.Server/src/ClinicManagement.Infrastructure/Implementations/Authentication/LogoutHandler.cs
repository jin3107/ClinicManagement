using ClinicManagement.Application.Interfaces.Authentication;
using ClinicManagement.Application.Interfaces.Repositories;

namespace ClinicManagement.Infrastructure.Implementations.Authentication
{
    public class LogoutHandler : ILogoutHandler
    {
        private readonly IRefreshTokenRepository _refreshTokenRepository;

        public LogoutHandler(IRefreshTokenRepository refreshTokenRepository)
        {
            _refreshTokenRepository = refreshTokenRepository;
        }

        public async Task HandleAsync(string refreshToken)
        {
            if (string.IsNullOrWhiteSpace(refreshToken))
                return;

            var tokenEntity = await _refreshTokenRepository.FindByTokenAsync(refreshToken);
            if (tokenEntity != null && !tokenEntity.IsRevoked)
            {
                tokenEntity.IsRevoked = true;
                tokenEntity.IsDeleted = true;
                await _refreshTokenRepository.EditAsync(tokenEntity);
            }
        }
    }
}
