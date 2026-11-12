namespace ClinicManagement.DTOs.Responses
{
    public class PhieuKhamResponse
    {
        public Guid MaPK { get; set; }
        public DateTime NgayKham { get; set; }
        public string? TrieuChung { get; set; }
        public string? ChuanDoan { get; set; }
        public string? HuongDieuTri { get; set; }
        public string? TrangThaiTiepNhan { get; set; }
        public Guid? MaLH { get; set; }
        public Guid? MaBS { get; set; }
        public string? TenBacSi { get; set; }
        public string? TenBenhNhan { get; set; }
    }
}
