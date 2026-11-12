using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ClinicManagement.Domain.Entities
{
    public class PrescriptionDetail : BaseEntity
    {
        [Key]
        public Guid MaCTDT { get; set; }

        [ForeignKey("Prescription")]
        public Guid? MaDT { get; set; }
        public Prescription? Prescription { get; set; }

        [ForeignKey("Medicine")]
        public Guid? MaThuoc { get; set; }
        public Medicine? Medicine { get; set; }

        public int SoLuong { get; set; }
        public string? LieuDung { get; set; }
    }
}
