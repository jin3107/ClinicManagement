using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClinicManagement.DTOs.Responses
{
    public class LichLamViecResponse
    {
        public Guid MaLLV { get; set; }
        public DateTime NgayLamViec { get; set; }
        public DateTime GioBatDau { get; set; }
        public DateTime GioKetThuc { get; set; }
        public Guid? MaBS { get; set; }
        public string? TenBacSi { get; set; }
    }
}
