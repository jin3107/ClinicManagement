using System;

namespace ClinicManagement.DTOs.Responses
{
    public class PhieuKhamDichVuResponse
    {
        public Guid Id { get; set; }
        public Guid MaPK { get; set; }
        public Guid MaDV { get; set; }
        public string? TenDV { get; set; }
        public decimal DonGia { get; set; }
    }
}
