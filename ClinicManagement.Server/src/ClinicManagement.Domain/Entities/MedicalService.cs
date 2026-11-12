using System;
using System.ComponentModel.DataAnnotations;

namespace ClinicManagement.Domain.Entities
{
    public class MedicalService : BaseEntity
    {
        [Key]
        public Guid MaDV { get; set; }
        public string TenDV { get; set; }
        public decimal DonGia { get; set; }
    }
}
