using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ClinicManagement.Domain.Entities
{
    public class WorkSchedule : BaseEntity
    {
        [Key]
        public Guid MaLLV { get; set; }
        public DateTime NgayLamViec { get; set; }
        public DateTime GioBatDau { get; set; }
        public DateTime GioKetThuc { get; set; }

        [ForeignKey("Doctor")]
        public Guid? MaBS { get; set; }
        public Doctor? Doctor { get; set; }
    }
}
