using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClinicManagement.DTOs.Requests
{
    public class BenhNhanRequest
    {
        public Guid? MaBN { get; set; }

        [Required(ErrorMessage = "Họ tên là bắt buộc.")]
        [MaxLength(100, ErrorMessage = "Họ tên không vượt quá 100 ký tự.")]
        public string HoTen { get; set; }

        public DateTime NgaySinh { get; set; }
        public bool GioiTinh { get; set; }

        [MaxLength(10, ErrorMessage = "Số điện thoại không vượt quá 10 ký tự.")]
        [Phone(ErrorMessage = "Số điện thoại không đúng định dạng.")]
        public string? SoDienThoai { get; set; }

        [MaxLength(200)]
        public string? DiaChi { get; set; }

        [MaxLength(20)]
        public string? SoBHYT { get; set; }

        [MaxLength(500)]
        public string? TienSuDiUng { get; set; }
    }
}
