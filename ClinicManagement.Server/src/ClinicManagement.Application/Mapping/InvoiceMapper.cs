using ClinicManagement.Domain.Entities;
using ClinicManagement.DTOs.Requests;
using ClinicManagement.DTOs.Responses;

namespace ClinicManagement.Application.Mapping
{
    public static class InvoiceMapper
    {
        public static HoaDonResponse ToResponse(Invoice e) => new()
        {
            MaHD = e.MaHD,
            NgayThanhToan = e.NgayThanhToan,
            TongTien = e.TongTien,
            TrangThaiThanhToan = e.TrangThaiThanhToan,
            MaLeTan = e.MaLeTan,
            MaPK = e.MaPK,
            TenBenhNhan = e.MedicalExamination?.Appointment?.Patient?.HoTen,
        };

        public static Invoice ToEntity(HoaDonRequest r) => new()
        {
            NgayThanhToan = r.NgayThanhToan,
            TongTien = r.TongTien,
            TrangThaiThanhToan = r.TrangThaiThanhToan,
            MaLeTan = r.MaLeTan,
            MaPK = r.MaPK,
        };
    }
}
