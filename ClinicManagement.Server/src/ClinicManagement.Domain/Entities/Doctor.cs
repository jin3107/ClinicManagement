using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ClinicManagement.Domain.Entities
{
    public class Doctor : BaseEntity
    {
        [Key]
        public Guid MaBS { get; set; }
        public string HoTen { get; set; }
        public string? ChuyenKhoa { get; set; }
        public string? SoDienThoai { get; set; }

        public string? MaTK { get; set; }

        public ICollection<Appointment>? Appointments { get; set; }
        public ICollection<MedicalExamination>? MedicalExaminations { get; set; }
        public ICollection<WorkSchedule>? WorkSchedules { get; set; }
    }
}
