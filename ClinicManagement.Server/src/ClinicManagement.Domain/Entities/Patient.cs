using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ClinicManagement.Domain.Entities
{
    public class Patient : BaseEntity
    {
        [Key]
        public Guid MaBN { get; set; }
        public string HoTen { get; set; }
        public DateTime NgaySinh { get; set; }
        public bool GioiTinh { get; set; }
        public string? SoDienThoai { get; set; }
        public string? DiaChi { get; set; }
        public string? SoBHYT { get; set; }
        public string? TienSuDiUng { get; set; }

        public ICollection<Appointment> Appointments { get; set; }
    }
}
