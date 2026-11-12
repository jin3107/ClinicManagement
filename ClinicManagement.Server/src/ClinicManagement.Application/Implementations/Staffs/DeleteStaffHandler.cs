using MayNghien.Infrastructures.Models.Responses;
using ClinicManagement.Application.Interfaces.Identity;
using ClinicManagement.Application.Interfaces.Staffs;
using ClinicManagement.Application.Interfaces.Repositories;

namespace ClinicManagement.Application.Implementations.Staffs
{
    public class DeleteStaffHandler : IDeleteStaffHandler
    {
        private readonly IStaffRepository _nhanVienRepo;
        private readonly ICurrentUserService _currentUser;

        public DeleteStaffHandler(IStaffRepository nhanVienRepo, ICurrentUserService currentUser)
        {
            _nhanVienRepo = nhanVienRepo;
            _currentUser = currentUser;
        }

        public async Task<AppResponse<string>> HandleAsync(Guid id)
        {
            var result = new AppResponse<string>();

            var callerEmail = _currentUser.GetEmail();
            if (callerEmail == null)
                return result.BuildError("Unauthorized");

            var staff = await _nhanVienRepo.GetAsync(id);
            if (staff == null || staff.IsDeleted == true)
                return result.BuildError("Không tìm thấy nhân viên.");

            staff.IsDeleted = true;
            staff.ModifiedBy = callerEmail;
            staff.ModifiedOn = DateTime.UtcNow;
            await _nhanVienRepo.EditAsync(staff);

            return result.BuildResult("Đã xóa nhân viên thành công.");
        }
    }
}
