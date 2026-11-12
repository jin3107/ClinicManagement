using MayNghien.Infrastructures.Models.Responses;
using ClinicManagement.Application.Interfaces.Authentication;
using ClinicManagement.Application.Interfaces.Repositories;
using ClinicManagement.DTOs.Authentication.Requests;

namespace ClinicManagement.Infrastructure.Implementations.Authentication
{
    public class VerifyOtpHandler : IVerifyOtpHandler
    {
        private readonly IOtpCodeRepository _otpRepository;

        public VerifyOtpHandler(IOtpCodeRepository otpRepository)
        {
            _otpRepository = otpRepository;
        }

        public async Task<AppResponse<bool>> HandleAsync(VerifyOtpRequest request)
        {
            var result = new AppResponse<bool>();

            var email = request.Email.Trim().ToLowerInvariant();
            var otp = await _otpRepository.FindActiveAsync(email);
            if (otp == null)
                return result.BuildError("Mã OTP không hợp lệ hoặc đã hết hạn.");

            if (otp.AttemptCount >= 5)
            {
                otp.IsUsed = true;
                await _otpRepository.UpdateAsync(otp);
                return result.BuildError("Bạn đã nhập sai quá số lần cho phép. Vui lòng yêu cầu mã OTP mới.");
            }

            if (otp.Code != request.Code)
            {
                otp.AttemptCount++;
                await _otpRepository.UpdateAsync(otp);
                return result.BuildError($"Mã OTP không đúng. Còn {5 - otp.AttemptCount} lần thử.");
            }

            otp.IsUsed = true;
            otp.ModifiedOn = DateTime.UtcNow;
            await _otpRepository.UpdateAsync(otp);

            return result.BuildResult(true, "Xác thực OTP thành công.");
        }
    }
}
