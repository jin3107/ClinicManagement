using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ClinicManagement.Domain.Entities
{
    public class Appointment : BaseEntity
    {
        [Key]
        public Guid MaLH { get; set; }
        public DateTime ThoiGianKham { get; set; }
        public string TrangThai { get; set; }

        [ForeignKey("Patient")]
        public Guid? MaBN { get; set; }
        public Patient? Patient { get; set; }

        [ForeignKey("Doctor")]
        public Guid? MaBS { get; set; }
        public Doctor? Doctor { get; set; }

        public MedicalExamination? MedicalExamination { get; set; }
    }
}
