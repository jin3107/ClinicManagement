using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClinicManagement.DTOs.Responses
{
    public class HoaDonResponse
    {
        public Guid MaHD { get; set; }
        public DateTime NgayThanhToan { get; set; }
        public decimal TongTien { get; set; }
        public string? TrangThaiThanhToan { get; set; }
        public string? MaLeTan { get; set; }
        public Guid? MaPK { get; set; }
        public string? TenBenhNhan { get; set; }
    }
}
