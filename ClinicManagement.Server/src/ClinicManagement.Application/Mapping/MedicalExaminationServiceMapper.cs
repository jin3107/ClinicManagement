using ClinicManagement.Domain.Entities;
using ClinicManagement.DTOs.Responses;

namespace ClinicManagement.Application.Mapping
{
    public static class MedicalExaminationServiceMapper
    {
        public static PhieuKhamDichVuResponse ToResponse(MedicalExaminationService entity) => new()
        {
            Id = entity.Id,
            MaPK = entity.MaPK,
            MaDV = entity.MaDV,
            TenDV = entity.MedicalService?.TenDV,
            DonGia = entity.DonGia,
        };
    }
}
