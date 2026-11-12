using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ClinicManagement.Domain.Entities
{
    public class MedicalExamination : BaseEntity
    {
        [Key]
        public Guid MaPK { get; set; }
        public DateTime NgayKham { get; set; }
        public string? TrieuChung { get; set; }
        public string? ChuanDoan { get; set; }
        public string? HuongDieuTri { get; set; }
        public string? TrangThaiTiepNhan { get; set; }

        [ForeignKey("Appointment")]
        public Guid? MaLH { get; set; }
        public Appointment? Appointment { get; set; }

        [ForeignKey("Doctor")]
        public Guid? MaBS { get; set; }
        public Doctor? Doctor { get; set; }

        public Invoice? Invoice { get; set; }
        public ICollection<Prescription>? Prescriptions { get; set; }
    }
}
