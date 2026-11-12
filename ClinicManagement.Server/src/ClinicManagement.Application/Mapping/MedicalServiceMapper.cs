using ClinicManagement.Domain.Entities;
using ClinicManagement.DTOs.Requests;
using ClinicManagement.DTOs.Responses;

namespace ClinicManagement.Application.Mapping
{
    public static class MedicalServiceMapper
    {
        public static DanhMucDichVuResponse ToResponse(MedicalService entity) => new()
        {
            MaDV = entity.MaDV,
            TenDV = entity.TenDV,
            DonGia = entity.DonGia
        };

        public static MedicalService ToEntity(DanhMucDichVuRequest request) => new()
        {
            TenDV = request.TenDV,
            DonGia = request.DonGia
        };
    }
}
