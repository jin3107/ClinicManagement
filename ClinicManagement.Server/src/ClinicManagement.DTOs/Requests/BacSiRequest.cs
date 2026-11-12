using MayNghien.Infrastructures.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClinicManagement.DTOs.Requests
{
    public class BacSiRequest
    {
        public Guid MaBS { get; set; }

        [Required(ErrorMessage = "Họ tên là bắt buộc.")]
        [MaxLength(100, ErrorMessage = "Họ tên không vượt quá 100 ký tự.")]
        public string HoTen { get; set; }

        [Required(ErrorMessage = "Chuyên khoa là bắt buộc.")]
        [MaxLength(100, ErrorMessage = "Chuyên khoa không vượt quá 100 ký tự.")]
        public string? ChuyenKhoa { get; set; }

        [Required(ErrorMessage = "Số điện thoại là bắt buộc.")]
        [MaxLength(10, ErrorMessage = "Số điện thoại không vượt quá 10 ký tự.")]
        [Phone(ErrorMessage = "Số điện thoại không đúng định dạng.")]
        public string? SoDienThoai { get; set; }

        [Required(ErrorMessage = "Email là bắt buộc.")]
        [EmailAddress(ErrorMessage = "Email không hợp lệ.")]
        public string Email { get; set; }

        [StringLength(20, MinimumLength = 6, ErrorMessage = "Mật khẩu có ít nhất là 6 ký tự.")]
        [DataType(DataType.Password)]
        public string? Password { get; set; }
    }
}
