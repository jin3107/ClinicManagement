using ClinicManagement.Domain.Entities;
using ClinicManagement.DTOs.Requests;
using ClinicManagement.DTOs.Responses;

namespace ClinicManagement.Application.Mapping
{
    public static class DoctorMapper
    {
        public static BacSiResponse ToResponse(Doctor entity, string? email = null)
        {
            return new BacSiResponse
            {
                MaBS = entity.MaBS,
                HoTen = entity.HoTen,
                ChuyenKhoa = entity.ChuyenKhoa,
                SoDienThoai = entity.SoDienThoai,
                Email = email
            };
        }

        public static Doctor ToEntity(BacSiRequest request)
        {
            return new Doctor
            {
                HoTen = request.HoTen,
                ChuyenKhoa = request.ChuyenKhoa,
                SoDienThoai = request.SoDienThoai
            };
        }
    }
}
