using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ClinicManagement.Domain.Entities
{
    public class Prescription : BaseEntity
    {
        [Key]
        public Guid MaDT { get; set; }
        public DateTime NgayKe { get; set; }

        [ForeignKey("MedicalExamination")]
        public Guid? MaPK { get; set; }
        public MedicalExamination? MedicalExamination { get; set; }

        public ICollection<PrescriptionDetail>? PrescriptionDetails { get; set; }
    }
}
