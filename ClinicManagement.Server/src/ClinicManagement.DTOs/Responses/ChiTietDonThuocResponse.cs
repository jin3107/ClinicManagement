using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClinicManagement.DTOs.Responses
{
    public class ChiTietDonThuocResponse
    {
        public Guid MaCTDT { get; set; }
        public Guid? MaThuoc { get; set; }
        public string? TenThuoc { get; set; }
        public decimal DonGia { get; set; }
        public int SoLuong { get; set; }
        public string? LieuDung { get; set; }
        public decimal ThanhTien => DonGia * SoLuong;
    }
}
