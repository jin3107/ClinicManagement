using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClinicManagement.DTOs.Authentication.Requests
{
    public class RegisterRequest
    {
        [Required(ErrorMessage = "Tên đăng ký là bắt buộc.")]
        [MaxLength(50, ErrorMessage = "Tên đăng ký không được vượt quá 50 ký tự.")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Email là bắt buộc.")]
        [EmailAddress]
        public string Email { get; set; }

        [Required(ErrorMessage = "Số điện thoại là bắt buộc.")]
        [Phone(ErrorMessage = "Số điện thoại không hợp lệ.")]
        [RegularExpression(@"^(0[3|5|7|8|9])\d{8}$",
            ErrorMessage = "Số điện thoại ở Việt Nam không hợp lệ.")]
        public string PhoneNumber { get; set; }

        [Required(ErrorMessage = "Mật khẩu là bắt buộc.")]
        [DataType(DataType.Password)]
        [Compare("ConfirmPassword", ErrorMessage = "Mật khẩu không khớp.")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Xác nhận mật khẩu là bắt buộc.")]
        [DataType(DataType.Password)]
        [Display(Name = "Confirm Password")]
        public string ConfirmPassword { get; set; }
    }
}
