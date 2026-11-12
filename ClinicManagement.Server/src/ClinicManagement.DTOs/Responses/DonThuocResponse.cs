using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClinicManagement.DTOs.Responses
{
    public class DonThuocResponse
    {
        public Guid MaDT { get; set; }
        public Guid? MaPK { get; set; }
        public DateTime NgayKe { get; set; }
        public List<ChiTietDonThuocResponse> ChiTietDonThuocs { get; set; } = [];
        public decimal TongTien => ChiTietDonThuocs.Sum(x => x.ThanhTien);
    }
}
