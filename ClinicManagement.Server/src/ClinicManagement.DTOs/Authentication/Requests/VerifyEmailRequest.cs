using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClinicManagement.DTOs.Authentication.Requests
{
    public class VerifyEmailRequest
    {
        [Required(ErrorMessage = "Email là bắt buộc.")]
        [EmailAddress]
        public string Email { get; set; }

        [Required(ErrorMessage = "Số điện thoại là bắt buộc.")]
        [Phone(ErrorMessage = "Số điện thoại không hợp lệ.")]
        [RegularExpression(@"^(0[3|5|7|8|9])\d{8}$",
             ErrorMessage = "Số điện thoại ở Việt Nam không hợp lệ.")]
        public string PhoneNumber { get; set; }
    }
}
