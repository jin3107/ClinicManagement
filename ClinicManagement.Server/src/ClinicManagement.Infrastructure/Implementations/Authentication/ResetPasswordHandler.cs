using MayNghien.Infrastructures.Models.Responses;
using Microsoft.AspNetCore.Identity;
using ClinicManagement.Application.Interfaces.Authentication;
using ClinicManagement.Application.Interfaces.Repositories;
using ClinicManagement.DTOs.Authentication.Requests;
using ClinicManagement.DTOs.Authentication.Responses;
using ClinicManagement.Infrastructure.Persistence.Entities;

namespace ClinicManagement.Infrastructure.Implementations.Authentication
{
    public class ResetPasswordHandler : IResetPasswordHandler
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IOtpCodeRepository _otpRepository;
        private readonly IRefreshTokenRepository _refreshTokenRepository;

        public ResetPasswordHandler(UserManager<ApplicationUser> userManager,
            IOtpCodeRepository otpRepository, IRefreshTokenRepository refreshTokenRepository)
        {
            _userManager = userManager;
            _otpRepository = otpRepository;
            _refreshTokenRepository = refreshTokenRepository;
        }

        public async Task<AppResponse<ResetPasswordResponse>> HandleAsync(ResetPasswordRequest request)
        {
            var result = new AppResponse<ResetPasswordResponse>();

            var email = request.Email.Trim().ToLowerInvariant();
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
                return result.BuildError("Không tìm thấy tài khoản.");

            var verifiedOtp = await _otpRepository.FindRecentlyVerifiedAsync(email);
            if (verifiedOtp == null)
                return result.BuildError("Bạn chưa xác thực OTP hoặc phiên xác thực đã hết hạn.");

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var resetResult = await _userManager.ResetPasswordAsync(user, token, request.NewPassword);
            if (!resetResult.Succeeded)
                return result.BuildError(string.Join(", ", resetResult.Errors.Select(e => e.Description)));

            await _refreshTokenRepository.RevokeByUserIdAsync(Guid.Parse(user.Id));

            verifiedOtp.IsDeleted = true;
            verifiedOtp.ModifiedOn = DateTime.UtcNow;
            await _otpRepository.UpdateAsync(verifiedOtp);

            return result.BuildResult(new ResetPasswordResponse { Email = email }, "Đặt lại mật khẩu thành công.");
        }
    }
}
