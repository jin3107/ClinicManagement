using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ClinicManagement.Application.Interfaces.Authentication;
using ClinicManagement.DTOs.Authentication.Requests;

namespace ClinicManagement.API.Controllers
{
    [Route("authentication")]
    [ApiController]
    public class AuthenticationsController : ControllerBase
    {
        private readonly ILoginHandler _loginHandler;
        private readonly IRegisterHandler _registerHandler;
        private readonly IChangePasswordHandler _changePasswordHandler;
        private readonly IRefreshTokenHandler _refreshTokenHandler;
        private readonly ILogoutHandler _logoutHandler;
        private readonly IGetProfileHandler _getProfileHandler;
        private readonly ISendOtpHandler _sendOtpHandler;
        private readonly IVerifyOtpHandler _verifyOtpHandler;
        private readonly IResetPasswordHandler _resetPasswordHandler;
        private readonly IConfiguration _config;

        public AuthenticationsController(
            ILoginHandler loginHandler,
            IRegisterHandler registerHandler,
            IChangePasswordHandler changePasswordHandler,
            IRefreshTokenHandler refreshTokenHandler,
            ILogoutHandler logoutHandler,
            IGetProfileHandler getProfileHandler,
            ISendOtpHandler sendOtpHandler,
            IVerifyOtpHandler verifyOtpHandler,
            IResetPasswordHandler resetPasswordHandler,
            IConfiguration config)
        {
            _loginHandler = loginHandler;
            _registerHandler = registerHandler;
            _changePasswordHandler = changePasswordHandler;
            _refreshTokenHandler = refreshTokenHandler;
            _logoutHandler = logoutHandler;
            _getProfileHandler = getProfileHandler;
            _sendOtpHandler = sendOtpHandler;
            _verifyOtpHandler = verifyOtpHandler;
            _resetPasswordHandler = resetPasswordHandler;
            _config = config;
        }

        private void SetRefreshTokenCookie(string? refreshToken)
        {
            if (string.IsNullOrWhiteSpace(refreshToken))
                return;

            var minutes = int.TryParse(_config["Jwt:RefreshTokenExpiresIn"], out var m) ? m : 10080;
            Response.Cookies.Append("RefreshToken", refreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Path = "/authentication",
                Expires = DateTimeOffset.UtcNow.AddMinutes(minutes),
            });
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var result = await _loginHandler.HandleAsync(request);
            if (result.IsSuccess)
                SetRefreshTokenCookie(result.Data?.RefreshToken);
            return Ok(result);
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            var result = await _registerHandler.HandleAsync(request);
            if (result.IsSuccess)
                SetRefreshTokenCookie(result.Data?.RefreshToken);
            return Ok(result);
        }

        [HttpGet("me")]
        [AllowAnonymous]
        public async Task<IActionResult> Me()
        {
            var result = await _getProfileHandler.HandleAsync();
            return Ok(result);
        }

        [HttpPost("refresh-token")]
        [AllowAnonymous]
        public async Task<IActionResult> RefreshToken()
        {
            var refreshToken = Request.Cookies["RefreshToken"];
            if (string.IsNullOrWhiteSpace(refreshToken))
                return Unauthorized(new { message = "No refresh token provided." });

            var result = await _refreshTokenHandler.HandleAsync(refreshToken);
            if (result.IsSuccess)
                SetRefreshTokenCookie(result.Data?.RefreshToken);
            return Ok(result);
        }

        [HttpPost("change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            var result = await _changePasswordHandler.HandleAsync(request);
            return Ok(result);
        }

        [HttpPost("send-otp")]
        [AllowAnonymous]
        public async Task<IActionResult> SendOtp([FromBody] SendOtpRequest request)
        {
            var result = await _sendOtpHandler.HandleAsync(request);
            return Ok(result);
        }

        [HttpPost("verify-otp")]
        [AllowAnonymous]
        public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpRequest request)
        {
            var result = await _verifyOtpHandler.HandleAsync(request);
            return Ok(result);
        }

        [HttpPost("reset-password")]
        [AllowAnonymous]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            var result = await _resetPasswordHandler.HandleAsync(request);
            return Ok(result);
        }

        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            var refreshToken = Request.Cookies["RefreshToken"] ?? string.Empty;
            await _logoutHandler.HandleAsync(refreshToken);
            Response.Cookies.Delete("RefreshToken", new CookieOptions { Path = "/authentication" });
            return Ok(new { message = "Logged out successfully." });
        }
    }
}
