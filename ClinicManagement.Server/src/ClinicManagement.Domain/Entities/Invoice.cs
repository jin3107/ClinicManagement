using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ClinicManagement.Domain.Entities
{
    public class Invoice : BaseEntity
    {
        [Key]
        public Guid MaHD { get; set; }
        public DateTime NgayThanhToan { get; set; }
        public decimal TongTien { get; set; }
        public string? TrangThaiThanhToan { get; set; }
        public string? MaLeTan { get; set; }

        [ForeignKey("MedicalExamination")]
        public Guid? MaPK { get; set; }
        public MedicalExamination? MedicalExamination { get; set; }
    }
}
