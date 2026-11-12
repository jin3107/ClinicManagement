using ClinicManagement.Domain.Entities;
using ClinicManagement.DTOs.Requests;
using ClinicManagement.DTOs.Responses;

namespace ClinicManagement.Application.Mapping
{
    public static class StaffMapper
    {
        public static NhanVienResponse ToResponse(Staff entity) => new()
        {
            MaNV = entity.MaNV,
            HoTen = entity.HoTen,
            Email = entity.Email,
            SoDienThoai = entity.SoDienThoai,
            Role = entity.Role
        };

        public static Staff ToEntity(NhanVienRequest request) => new()
        {
            HoTen = request.HoTen,
            Email = request.Email,
            SoDienThoai = request.SoDienThoai,
            Role = request.Role,
            Password = string.Empty,
        };
    }
}
