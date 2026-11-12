using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ClinicManagement.Domain.Entities
{
    public class MedicalExaminationService : BaseEntity
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [ForeignKey("MedicalExamination")]
        public Guid MaPK { get; set; }
        public MedicalExamination? MedicalExamination { get; set; }

        [ForeignKey("MedicalService")]
        public Guid MaDV { get; set; }
        public MedicalService? MedicalService { get; set; }

        public decimal DonGia { get; set; }
    }
}
