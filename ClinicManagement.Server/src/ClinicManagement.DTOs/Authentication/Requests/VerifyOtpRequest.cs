using System.ComponentModel.DataAnnotations;

namespace ClinicManagement.DTOs.Authentication.Requests
{
    public class VerifyOtpRequest
    {
        [Required(ErrorMessage = "Email là bắt buộc.")]
        [EmailAddress(ErrorMessage = "Email không hợp lệ.")]
        public string Email { get; set; } = default!;

        [Required(ErrorMessage = "Mã OTP là bắt buộc.")]
        [StringLength(6, MinimumLength = 6, ErrorMessage = "Mã OTP gồm 6 chữ số.")]
        public string Code { get; set; } = default!;
    }
}
