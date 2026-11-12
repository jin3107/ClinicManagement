using MayNghien.Infrastructures.Models.Responses;
using ClinicManagement.Application.Interfaces.Identity;
using ClinicManagement.Application.Interfaces.Staffs;
using ClinicManagement.Application.Interfaces.Repositories;

namespace ClinicManagement.Application.Implementations.Staffs
{
    public class DeleteStaffHandler : IDeleteStaffHandler
    {
        private readonly IStaffRepository _nhanVienRepo;
        private readonly IIdentityUserService _identityUserService;
        private readonly IRefreshTokenRepository _refreshTokenRepository;
        private readonly ICurrentUserService _currentUser;

        public DeleteStaffHandler(IStaffRepository nhanVienRepo,
            IIdentityUserService identityUserService,
            IRefreshTokenRepository refreshTokenRepository,
            ICurrentUserService currentUser)
        {
            _nhanVienRepo = nhanVienRepo;
            _identityUserService = identityUserService;
            _refreshTokenRepository = refreshTokenRepository;
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

            // Remove the login account too; otherwise a "deleted" staff member can still sign in.
            var userId = await _identityUserService.GetUserIdByEmailAsync(staff.Email);
            if (userId != null)
            {
                if (Guid.TryParse(userId, out var userGuid))
                    await _refreshTokenRepository.RevokeByUserIdAsync(userGuid);

                var deleteResult = await _identityUserService.DeleteUserAsync(userId);
                if (!deleteResult.Succeeded)
                    return result.BuildError("Không thể xóa tài khoản người dùng: "
                        + string.Join(", ", deleteResult.Errors.Select(e => e.Description)));
            }

            staff.IsDeleted = true;
            staff.ModifiedBy = callerEmail;
            staff.ModifiedOn = DateTime.UtcNow;
            await _nhanVienRepo.EditAsync(staff);

            return result.BuildResult("Đã xóa nhân viên thành công.");
        }
    }
}
