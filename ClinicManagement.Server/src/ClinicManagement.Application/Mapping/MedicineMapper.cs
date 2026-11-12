using ClinicManagement.Domain.Entities;
using ClinicManagement.DTOs.Requests;
using ClinicManagement.DTOs.Responses;

namespace ClinicManagement.Application.Mapping
{
    public static class MedicineMapper
    {
        public static DanhMucThuocResponse ToResponse(Medicine entity) => new()
        {
            MaThuoc = entity.MaThuoc,
            TenThuoc = entity.TenThuoc,
            DonGia = entity.DonGia,
            ChongChiDinh = entity.ChongChiDinh
        };

        public static Medicine ToEntity(DanhMucThuocRequest request) => new()
        {
            TenThuoc = request.TenThuoc,
            DonGia = request.DonGia,
            ChongChiDinh = request.ChongChiDinh
        };
    }
}
