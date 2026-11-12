using Microsoft.Extensions.Logging;
using ClinicManagement.Application.Interfaces.Background;
using ClinicManagement.Application.Interfaces.Repositories;

namespace ClinicManagement.Application.Implementations.Background
{
    public class ClearExpiredDataHandler : IClearExpiredDataHandler
    {
        private readonly IOtpCodeRepository _otpRepository;
        private readonly ILogger<ClearExpiredDataHandler> _logger;

        public ClearExpiredDataHandler(IOtpCodeRepository otpRepository, ILogger<ClearExpiredDataHandler> logger)
        {
            _otpRepository = otpRepository;
            _logger = logger;
        }

        public async Task HandleAsync()
        {
            _logger.LogInformation("Clearing expired OTP codes at {Time}", DateTime.UtcNow);
            await _otpRepository.ClearExpiredAsync();
            _logger.LogInformation("OTP cleanup completed");
        }
    }
}
