using ClinicManagement.Domain.Entities;
using ClinicManagement.DTOs.Requests;
using ClinicManagement.DTOs.Responses;

namespace ClinicManagement.Application.Mapping
{
    public static class AppointmentMapper
    {
        public static LichHenResponse ToResponse(Appointment entity) => new()
        {
            MaLH = entity.MaLH,
            ThoiGianKham = entity.ThoiGianKham,
            TrangThai = entity.TrangThai,
            MaBN = entity.MaBN,
            MaBS = entity.MaBS,
            CreatedBy = entity.CreatedBy
        };

        public static Appointment ToEntity(LichHenRequest request) => new()
        {
            ThoiGianKham = request.ThoiGianKham,
            TrangThai = request.TrangThai,
            MaBN = request.MaBN,
            MaBS = request.MaBS
        };
    }
}
