using MayNghien.Infrastructures.Models.Responses;
using ClinicManagement.DTOs.Authentication.Requests;
using ClinicManagement.DTOs.Authentication.Responses;

namespace ClinicManagement.Application.Interfaces.Authentication
{
    public interface ILoginHandler
    {
        Task<AppResponse<LoginResponse>> HandleAsync(LoginRequest request);
    }

    public interface IRegisterHandler
    {
        Task<AppResponse<RegisterResponse>> HandleAsync(RegisterRequest request);
    }

    public interface IChangePasswordHandler
    {
        Task<AppResponse<ChangePasswordResponse>> HandleAsync(ChangePasswordRequest request);
    }

    public interface IRefreshTokenHandler
    {
        Task<AppResponse<RefreshTokenResponse>> HandleAsync(string refreshToken);
    }

    public interface ILogoutHandler
    {
        Task HandleAsync(string refreshToken);
    }

    public interface IGetProfileHandler
    {
        Task<AppResponse<ProfileResponse>> HandleAsync();
    }

    public interface ISendOtpHandler
    {
        Task<AppResponse<SendOtpResponse>> HandleAsync(SendOtpRequest request);
    }

    public interface IVerifyOtpHandler
    {
        Task<AppResponse<bool>> HandleAsync(VerifyOtpRequest request);
    }

    public interface IResetPasswordHandler
    {
        Task<AppResponse<ResetPasswordResponse>> HandleAsync(ResetPasswordRequest request);
    }
}
