using System;

namespace ClinicManagement.DTOs.Responses
{
    public class NhanVienResponse
    {
        public Guid MaNV { get; set; }
        public string HoTen { get; set; }
        public string? Email { get; set; }
        public string? SoDienThoai { get; set; }
        public string Role { get; set; }
    }
}
