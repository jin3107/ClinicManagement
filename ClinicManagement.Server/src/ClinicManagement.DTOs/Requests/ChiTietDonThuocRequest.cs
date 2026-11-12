using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClinicManagement.DTOs.Requests
{
    public class ChiTietDonThuocRequest
    {
        public Guid? MaCTDT { get; set; }

        [Required(ErrorMessage = "Mã thuốc là bắt buộc.")]
        public Guid MaThuoc { get; set; }

        [Required(ErrorMessage = "Số lượng là bắt buộc.")]
        [Range(1, 9999, ErrorMessage = "Số lượng phải từ 1 đến 9999.")]
        public int SoLuong { get; set; }

        [MaxLength(500, ErrorMessage = "Liều dùng không vượt quá 500 ký tự.")]
        public string? LieuDung { get; set; }
    }
}
