using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClinicManagement.DTOs.Authentication.Requests
{
    public class LoginRequest
    {
        [Required(ErrorMessage = "Tên người dùng là bắt buộc.")]
        [MaxLength(50, ErrorMessage = "Tên người dùng không được vượt quá 50 ký tự.")]
        public string UserName { get; set; }

        [Required(ErrorMessage = "Mật khẩu là bắt buộc.")]
        [DataType(DataType.Password)]
        public string Password { get; set; }
    }
}
