using MayNghien.Infrastructures.Models.Responses;
using Microsoft.EntityFrameworkCore;
using ClinicManagement.Application.Interfaces.Invoices;
using ClinicManagement.Application.Interfaces.Identity;
using ClinicManagement.Application.Interfaces.Repositories;
using ClinicManagement.Application.Mapping;
using ClinicManagement.DTOs.Requests;
using ClinicManagement.DTOs.Responses;

namespace ClinicManagement.Application.Implementations.Invoices
{
    public class UpdateInvoiceHandler : IUpdateInvoiceHandler
    {
        private readonly IInvoiceRepository _hoaDonRepo;
        private readonly ICurrentUserService _currentUser;

        public UpdateInvoiceHandler(IInvoiceRepository hoaDonRepo, ICurrentUserService currentUser)
        {
            _hoaDonRepo = hoaDonRepo;
            _currentUser = currentUser;
        }

        public async Task<AppResponse<HoaDonResponse>> HandleAsync(HoaDonRequest request)
        {
            var result = new AppResponse<HoaDonResponse>();

            var callerEmail = _currentUser.GetEmail();
            if (callerEmail == null)
                return result.BuildError("Unauthorized");

            var entity = await _hoaDonRepo
                .FindBy(x => x.MaHD == request.MaHD && x.IsDeleted == false)
                .Include(x => x.MedicalExamination!).ThenInclude(p => p.Appointment!).ThenInclude(l => l.Patient)
                .FirstOrDefaultAsync();
            if (entity == null)
                return result.BuildError("Thông tin hóa đơn không tồn tại.");

            entity.NgayThanhToan = request.NgayThanhToan;
            entity.TongTien = request.TongTien;
            entity.TrangThaiThanhToan = request.TrangThaiThanhToan;
            entity.ModifiedBy = callerEmail;
            entity.ModifiedOn = DateTime.UtcNow;
            await _hoaDonRepo.EditAsync(entity);

            return result.BuildResult(InvoiceMapper.ToResponse(entity), "Cập nhật thông tin hóa đơn thành công.");
        }
    }
}
