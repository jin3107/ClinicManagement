using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClinicManagement.DTOs.Requests
{
    public class HoaDonRequest
    {
        public Guid? MaHD { get; set; }

        [Required(ErrorMessage = "Ngày thanh toán là bắt buộc.")]
        public DateTime NgayThanhToan { get; set; }

        public decimal TongTien { get; set; }

        [MaxLength(50, ErrorMessage = "Trạng thái thanh toán không vượt quá 50 ký tự.")]
        public string? TrangThaiThanhToan { get; set; }

        [MaxLength(450, ErrorMessage = "Mã lễ tân không vượt quá 450 ký tự.")]
        public string? MaLeTan { get; set; }

        public Guid? MaPK { get; set; }
    }
}
