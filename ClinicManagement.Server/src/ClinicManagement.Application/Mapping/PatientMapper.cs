using ClinicManagement.Domain.Entities;
using ClinicManagement.DTOs.Requests;
using ClinicManagement.DTOs.Responses;

namespace ClinicManagement.Application.Mapping
{
    public static class PatientMapper
    {
        public static BenhNhanResponse ToResponse(Patient e) => new()
        {
            MaBN = e.MaBN,
            HoTen = e.HoTen,
            NgaySinh = e.NgaySinh,
            GioiTinh = e.GioiTinh,
            SoDienThoai = e.SoDienThoai,
            DiaChi = e.DiaChi,
            SoBHYT = e.SoBHYT,
            TienSuDiUng = e.TienSuDiUng,
        };

        public static Patient ToEntity(BenhNhanRequest r) => new()
        {
            HoTen = r.HoTen,
            NgaySinh = r.NgaySinh,
            GioiTinh = r.GioiTinh,
            SoDienThoai = r.SoDienThoai,
            DiaChi = r.DiaChi,
            SoBHYT = r.SoBHYT,
            TienSuDiUng = r.TienSuDiUng,
        };
    }
}
