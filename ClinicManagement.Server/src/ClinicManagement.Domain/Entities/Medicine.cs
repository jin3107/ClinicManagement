using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ClinicManagement.Domain.Entities
{
    public class Medicine : BaseEntity
    {
        [Key]
        public Guid MaThuoc { get; set; }
        public string TenThuoc { get; set; }
        public decimal DonGia { get; set; }
        public string? ChongChiDinh { get; set; }

        public ICollection<PrescriptionDetail>? PrescriptionDetails { get; set; }
    }
}
