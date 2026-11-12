using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClinicManagement.DTOs.Responses
{
    public class DanhMucDichVuResponse
    {
        public Guid MaDV { get; set; }
        public string TenDV { get; set; }
        public decimal DonGia { get; set; }
    }
}
