using MayNghien.Infrastructures.Models.Responses;
using Microsoft.EntityFrameworkCore;
using ClinicManagement.Application.Interfaces.Prescriptions;
using ClinicManagement.Application.Interfaces.Identity;
using ClinicManagement.Application.Interfaces.Repositories;

namespace ClinicManagement.Application.Implementations.Prescriptions
{
    public class DeletePrescriptionHandler : IDeletePrescriptionHandler
    {
        private readonly IPrescriptionRepository _donThuocRepo;
        private readonly IPrescriptionDetailRepository _chiTietRepo;
        private readonly ICurrentUserService _currentUser;

        public DeletePrescriptionHandler(IPrescriptionRepository donThuocRepo,
            IPrescriptionDetailRepository chiTietRepo, ICurrentUserService currentUser)
        {
            _donThuocRepo = donThuocRepo;
            _chiTietRepo = chiTietRepo;
            _currentUser = currentUser;
        }

        public async Task<AppResponse<string>> HandleAsync(Guid id)
        {
            var result = new AppResponse<string>();

            var callerEmail = _currentUser.GetEmail();
            if (callerEmail == null)
                return result.BuildError("Unauthorized");

            var donThuoc = await _donThuocRepo
                .FindBy(x => x.MaDT == id && x.IsDeleted == false)
                .Include(x => x.PrescriptionDetails)
                .FirstOrDefaultAsync();
            if (donThuoc == null)
                return result.BuildError("Thông tin đơn thuốc không tồn tại.");

            var chiTietList = donThuoc.PrescriptionDetails?.ToList() ?? [];
            if (chiTietList.Count > 0)
            {
                foreach (var ct in chiTietList)
                {
                    ct.IsDeleted = true;
                    ct.ModifiedBy = callerEmail;
                    ct.ModifiedOn = DateTime.UtcNow;
                }
                await _chiTietRepo.EditRangeAsync(chiTietList);
            }

            donThuoc.IsDeleted = true;
            donThuoc.ModifiedBy = callerEmail;
            donThuoc.ModifiedOn = DateTime.UtcNow;
            await _donThuocRepo.EditAsync(donThuoc);

            return result.BuildResult("Đã xóa thông tin đơn thuốc thành công.");
        }
    }
}
