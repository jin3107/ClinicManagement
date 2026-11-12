using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClinicManagement.DTOs.Requests
{
    public class DanhMucThuocRequest
    {
        public Guid MaThuoc { get; set; }

        [Required(ErrorMessage = "Tên thuốc là bắt buộc.")]
        [MaxLength(300, ErrorMessage = "Tên thuốc không vượt quá 300 ký tự.")]
        public string TenThuoc { get; set; }

        [Required(ErrorMessage = "Đơn giá thuốc là bắt buộc.")]
        [Range(0.01, 999_999_999, ErrorMessage = "Đơn giá phải từ 0.01 đến 999,999,999.")]
        public decimal DonGia { get; set; }

        [MaxLength(1000, ErrorMessage = "Chống chỉ định không vượt quá 1000 ký tự.")]
        public string? ChongChiDinh { get; set; }
    }
}
