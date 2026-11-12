using MayNghien.Infrastructures.Models.Responses;
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

        public CreateInvoiceHandler(IInvoiceRepository hoaDonRepo, ICurrentUserService currentUser)
        {
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
