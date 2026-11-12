using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClinicManagement.DTOs.Responses
{
    public class LichHenResponse
    {
        public Guid MaLH { get; set; }
        public DateTime ThoiGianKham { get; set; }
        public string TrangThai { get; set; }

        public Guid? MaBN { get; set; }
        public Guid? MaBS { get; set; }
        public string? CreatedBy { get; set; }
    }
}
