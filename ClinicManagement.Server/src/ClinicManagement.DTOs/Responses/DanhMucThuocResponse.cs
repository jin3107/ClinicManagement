using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClinicManagement.DTOs.Responses
{
    public class DanhMucThuocResponse
    {
        public Guid MaThuoc { get; set; }
        public string TenThuoc { get; set; }
        public decimal DonGia { get; set; }
        public string? ChongChiDinh { get; set; }
    }
}
