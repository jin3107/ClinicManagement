using System.ComponentModel.DataAnnotations;

namespace ClinicManagement.DTOs.Authentication.Requests
{
    public class SendOtpRequest
    {
        [Required(ErrorMessage = "Email là bắt buộc.")]
        [EmailAddress(ErrorMessage = "Email không hợp lệ.")]
        public string Email { get; set; } = default!;
    }
}
