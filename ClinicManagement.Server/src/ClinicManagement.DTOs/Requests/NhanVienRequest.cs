using ClinicManagement.Commons.Enum;
using System.ComponentModel.DataAnnotations;

namespace ClinicManagement.DTOs.Requests
{
    public class NhanVienRequest
    {
        public Guid MaNV { get; set; }

        [Required(ErrorMessage = "Họ tên là bắt buộc.")]
        [MaxLength(100, ErrorMessage = "Họ tên không vượt quá 100 ký tự.")]
        public string HoTen { get; set; }

        [Required(ErrorMessage = "Email là bắt buộc.")]
        [EmailAddress(ErrorMessage = "Email khong hop le.")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Số điện thoại là bắt buộc.")]
        [MaxLength(10, ErrorMessage = "Số điện thoại không vượt quá 10 ký tự.")]
        [Phone(ErrorMessage = "Số điện thoại không đúng định dạng.")]
        public string? SoDienThoai { get; set; }

        [Required(ErrorMessage = "Mật khẩu là bắt buộc.")]
        [StringLength(20, MinimumLength = 6, ErrorMessage = "Mật khẩu có ít nhất là 6 ký tự.")]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        [Required(ErrorMessage = "Vai trò là bắt buộc.")]
        public string Role { get; set; }
    }
}
