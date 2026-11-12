using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClinicManagement.DTOs.Requests
{
    public class PhieuKhamRequest
    {
        public Guid? MaPK { get; set; }

        [Required(ErrorMessage = "Ngày khám là bắt buộc.")]
        public DateTime NgayKham { get; set; }

        [MaxLength(1000, ErrorMessage = "Tiệu chứng không vượt quá 100 ký tự.")]
        public string? TrieuChung { get; set; }

        [MaxLength(1000, ErrorMessage = "Chuẩn đoán không vượt quá 1000 ký tự.")]
        public string? ChuanDoan { get; set; }

        [MaxLength(1000, ErrorMessage = "Hướng điều trị không vượt quá 1000 ký tự.")]
        public string? HuongDieuTri { get; set; }

        [MaxLength(50, ErrorMessage = "Trạng thái tiếp nhận không vượt quá 50 ký tự.")]
        public string? TrangThaiTiepNhan { get; set; }

        public Guid? MaLH { get; set; }
        public Guid? MaBS { get; set; }
    }
}
