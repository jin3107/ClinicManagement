using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClinicManagement.DTOs.Requests
{
    public class DanhMucDichVuRequest
    {
        public Guid MaDV { get; set; }

        [Required(ErrorMessage = "Tên dịch vụ là bắt buộc.")]
        [MaxLength(500, ErrorMessage = "Tên dịch vụ không vượt quá 500 ký tự.")]
        public string TenDV { get; set; }

        [Required(ErrorMessage = "Đơn giá là bắt buộc.")]
        [Range(0.01, 999_999_999, ErrorMessage = "Đơn giá phải từ 0.01 đến 999,999,999")]
        public decimal DonGia { get; set; }
    }
}
