using System.ComponentModel.DataAnnotations;

namespace ClinicManagement.DTOs.Authentication.Requests
{
    public class ResetPasswordRequest
    {
        [Required(ErrorMessage = "Email là bắt buộc.")]
        [EmailAddress(ErrorMessage = "Email không hợp lệ.")]
        public string Email { get; set; } = default!;

        [Required(ErrorMessage = "Mật khẩu mới là bắt buộc.")]
        [StringLength(40, MinimumLength = 8, ErrorMessage = "Mật khẩu phải có ít nhất 8 ký tự và tối đa 40 ký tự.")]
        [DataType(DataType.Password)]
        [Compare("ConfirmNewPassword", ErrorMessage = "Mật khẩu không khớp.")]
        public string NewPassword { get; set; } = default!;

        [Required(ErrorMessage = "Xác nhận mật khẩu là bắt buộc.")]
        [DataType(DataType.Password)]
        public string ConfirmNewPassword { get; set; } = default!;
    }
}
