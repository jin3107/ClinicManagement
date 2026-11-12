using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClinicManagement.DTOs.Responses
{
    public class BenhNhanResponse
    {
        public Guid MaBN { get; set; }
        public string HoTen { get; set; }
        public DateTime NgaySinh { get; set; }
        public bool GioiTinh { get; set; }
        public string? SoDienThoai { get; set; }
        public string? DiaChi { get; set; }
        public string? SoBHYT { get; set; }
        public string? TienSuDiUng { get; set; }
    }
}
