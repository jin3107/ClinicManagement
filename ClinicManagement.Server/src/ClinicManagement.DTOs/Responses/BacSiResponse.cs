using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClinicManagement.DTOs.Responses
{
    public class BacSiResponse
    {
        public Guid MaBS { get; set; }
        public string HoTen { get; set; }
        public string? ChuyenKhoa { get; set; }
        public string? SoDienThoai { get; set; }
        public string? Email { get; set; }
    }
}
