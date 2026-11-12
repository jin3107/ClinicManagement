using MayNghien.Infrastructures.Models.Responses;
using ClinicManagement.Application.Interfaces.Invoices;
using ClinicManagement.Application.Interfaces.Identity;
using ClinicManagement.Application.Interfaces.Repositories;

namespace ClinicManagement.Application.Implementations.Invoices
{
    public class DeleteInvoiceHandler : IDeleteInvoiceHandler
    {
        private readonly IInvoiceRepository _hoaDonRepo;
        private readonly ICurrentUserService _currentUser;

        public DeleteInvoiceHandler(IInvoiceRepository hoaDonRepo, ICurrentUserService currentUser)
        {
            _hoaDonRepo = hoaDonRepo;
            _currentUser = currentUser;
        }

        public async Task<AppResponse<string>> HandleAsync(Guid id)
        {
            var result = new AppResponse<string>();

            var callerEmail = _currentUser.GetEmail();
            if (callerEmail == null)
                return result.BuildError("Unauthorized");

            var entity = await _hoaDonRepo.GetAsync(id);
            if (entity == null || entity.IsDeleted == true)
                return result.BuildError("Thông tin hóa đơn không tồn tại.");

            entity.IsDeleted = true;
            entity.ModifiedBy = callerEmail;
            entity.ModifiedOn = DateTime.UtcNow;
            await _hoaDonRepo.EditAsync(entity);

            return result.BuildResult("Đã xóa thông tin hóa đơn thành công.");
        }
    }
}
