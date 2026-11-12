using System;
using System.ComponentModel.DataAnnotations;

namespace ClinicManagement.Domain.Entities
{
    public class Staff : BaseEntity
    {
        [Key]
        public Guid MaNV { get; set; }
        public string HoTen { get; set; }
        public string? SoDienThoai { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
    }
}
