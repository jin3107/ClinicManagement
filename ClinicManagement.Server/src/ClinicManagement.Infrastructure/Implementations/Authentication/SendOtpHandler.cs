using MayNghien.Infrastructures.Models.Responses;
using Microsoft.AspNetCore.Identity;
using System.Security.Cryptography;
using ClinicManagement.Application.Interfaces.Authentication;
using ClinicManagement.Application.Interfaces.Background;
using ClinicManagement.Application.Interfaces.Repositories;
using ClinicManagement.Domain.Entities;
using ClinicManagement.Domain.Enums;
using ClinicManagement.DTOs.Authentication.Requests;
using ClinicManagement.DTOs.Authentication.Responses;
using ClinicManagement.Infrastructure.Persistence.Entities;

namespace ClinicManagement.Infrastructure.Implementations.Authentication
{
    public class SendOtpHandler : ISendOtpHandler
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IOtpCodeRepository _otpRepository;
        private readonly IEmailService _emailService;

        public SendOtpHandler(UserManager<ApplicationUser> userManager,
            IOtpCodeRepository otpRepository, IEmailService emailService)
        {
            _userManager = userManager;
            _otpRepository = otpRepository;
            _emailService = emailService;
        }

        public async Task<AppResponse<SendOtpResponse>> HandleAsync(SendOtpRequest request)
        {
            var result = new AppResponse<SendOtpResponse>();

            var email = request.Email.Trim().ToLowerInvariant();
            const string sentMessage = "Nếu email tồn tại trong hệ thống, mã OTP đã được gửi.";
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
                // Same response as success so emails cannot be enumerated.
                return result.BuildResult(new SendOtpResponse { Email = email }, sentMessage);

            // Resend cooldown: blocks OTP spam / email bombing and repeated fresh guess budgets.
            var active = await _otpRepository.FindActiveAsync(email);
            if (active?.CreatedOn != null && active.CreatedOn > DateTime.UtcNow.AddSeconds(-60))
                return result.BuildError("Vui lòng đợi 60 giây trước khi yêu cầu mã OTP mới.");

            await _otpRepository.InvalidatePreviousAsync(email);

            var otp = GenerateOtp();
            await _otpRepository.AddAsync(new OtpCode
            {
                Email = email,
                Code = otp,
                Purpose = OtpPurpose.ResetPassword,
                ExpiresAt = DateTime.UtcNow.AddMinutes(5),
                IsUsed = false,
                AttemptCount = 0,
            });

            await _emailService.SendEmailAsync(email, "Mã xác thực đặt lại mật khẩu - Quản Lý Phòng Khám",
                $"Mã OTP của bạn là: {otp}\nMã có hiệu lực trong 5 phút.");

            return result.BuildResult(new SendOtpResponse { Email = email }, sentMessage);
        }

        private static string GenerateOtp()
            => RandomNumberGenerator.GetInt32(0, 1_000_000).ToString("D6");
    }
}
