using ClinicManagement.Domain.Entities;
using ClinicManagement.DTOs.Requests;
using ClinicManagement.DTOs.Responses;

namespace ClinicManagement.Application.Mapping
{
    public static class MedicalExaminationMapper
    {
        public static PhieuKhamResponse ToResponse(MedicalExamination e) => new()
        {
            MaPK = e.MaPK,
            NgayKham = e.NgayKham,
            TrieuChung = e.TrieuChung,
            ChuanDoan = e.ChuanDoan,
            HuongDieuTri = e.HuongDieuTri,
            TrangThaiTiepNhan = e.TrangThaiTiepNhan,
            MaLH = e.MaLH,
            MaBS = e.MaBS,
            TenBacSi = e.Doctor?.HoTen,
            TenBenhNhan = e.Appointment?.Patient?.HoTen,
        };

        public static MedicalExamination ToEntity(PhieuKhamRequest r) => new()
        {
            NgayKham = r.NgayKham,
            TrieuChung = r.TrieuChung,
            ChuanDoan = r.ChuanDoan,
            HuongDieuTri = r.HuongDieuTri,
            TrangThaiTiepNhan = r.TrangThaiTiepNhan,
            MaLH = r.MaLH,
            MaBS = r.MaBS,
        };
    }
}
