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
    public class CreateInvoiceHandler : ICreateInvoiceHandler
    {
        private readonly IInvoiceRepository _hoaDonRepo;
        private readonly ICurrentUserService _currentUser;
        private readonly IMedicalExaminationRepository _examRepo;

        public CreateInvoiceHandler(IInvoiceRepository hoaDonRepo, ICurrentUserService currentUser,
            IMedicalExaminationRepository examRepo)
        {
            _examRepo = examRepo;
            _hoaDonRepo = hoaDonRepo;
            _currentUser = currentUser;
        }

        public async Task<AppResponse<HoaDonResponse>> HandleAsync(HoaDonRequest request)
        {
            var result = new AppResponse<HoaDonResponse>();

            var callerEmail = _currentUser.GetEmail();
            var callerId = _currentUser.GetUserId();
            if (callerEmail == null || callerId == null)
                return result.BuildError("Unauthorized");

            if (request.TongTien < 0)
                return result.BuildError("Tổng tiền không hợp lệ.");

            if (request.MaPK != null)
            {
                if (!await _examRepo.FindBy(x => x.MaPK == request.MaPK && x.IsDeleted == false).AnyAsync())
                    return result.BuildError("Phiếu khám không tồn tại.");

                if (await _hoaDonRepo.FindBy(x => x.MaPK == request.MaPK && x.IsDeleted == false).AnyAsync())
                    return result.BuildError("Phiếu khám này đã có hóa đơn.");
            }

            var entity = InvoiceMapper.ToEntity(request);
            entity.MaHD = Guid.NewGuid();
            entity.MaLeTan = callerId;
            entity.CreatedBy = callerEmail;
            entity.CreatedOn = DateTime.UtcNow;
            entity.IsDeleted = false;
            await _hoaDonRepo.AddAsync(entity);

            return result.BuildResult(InvoiceMapper.ToResponse(entity), "Thêm thông tin hóa đơn thành công.");
        }
    }
}
