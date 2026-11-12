using MayNghien.Infrastructures.Models.Responses;
using Microsoft.AspNetCore.Identity;
using ClinicManagement.Application.Interfaces.Identity;
using ClinicManagement.Application.Interfaces.Staffs;
using ClinicManagement.Application.Interfaces.Repositories;
using ClinicManagement.Application.Mapping;
using ClinicManagement.Commons.Enum;
using ClinicManagement.Domain.Entities;
using ClinicManagement.DTOs.Requests;
using ClinicManagement.DTOs.Responses;

namespace ClinicManagement.Application.Implementations.Staffs
{
    public class UpdateStaffHandler : IUpdateStaffHandler
    {
        private readonly IStaffRepository _nhanVienRepo;
        private readonly IIdentityUserService _identityUserService;
        private readonly ICurrentUserService _currentUser;

        public UpdateStaffHandler(IStaffRepository nhanVienRepo,
            IIdentityUserService identityUserService, ICurrentUserService currentUser)
        {
            _nhanVienRepo = nhanVienRepo;
            _identityUserService = identityUserService;
            _currentUser = currentUser;
        }

        public async Task<AppResponse<NhanVienResponse>> HandleAsync(NhanVienRequest request)
        {
            var result = new AppResponse<NhanVienResponse>();

            var callerEmail = _currentUser.GetEmail();
            if (callerEmail == null)
                return result.BuildError("Unauthorized");

            if (request.MaNV == Guid.Empty)
                return result.BuildError("Staff ID is required.");

            var staff = await _nhanVienRepo.GetAsync(request.MaNV);
            if (staff == null || staff.IsDeleted)
                return result.BuildError("Không tìm thấy nhân viên.");

            if (!Enum.TryParse<Role>(request.Role, out var roleEnum))
                return result.BuildError($"Vai trò '{request.Role}' không hợp lệ.");

            var userId = await _identityUserService.GetUserIdByEmailAsync(staff.Email);
            if (userId == null)
                return result.BuildError("Không tìm thấy tài khoản người dùng liên kết.");

            if ((staff.Email != request.Email || staff.SoDienThoai != request.SoDienThoai)
                && await _identityUserService.UserExistsAsync(request.Email, request.SoDienThoai!, userId))
                return result.BuildError("Email hoặc số điện thoại đã được sử dụng.");

            var updateResult = await _identityUserService.UpdateUserAsync(
                userId, request.Email, request.SoDienThoai, request.HoTen, roleEnum,
                string.IsNullOrEmpty(request.Password) ? null : request.Password);

            if (!updateResult.Succeeded)
                return result.BuildError("Cập nhật người dùng thất bại: "
                    + string.Join(", ", updateResult.Errors.Select(e => e.Description)));

            await _identityUserService.AssignRoleAsync(userId, roleEnum.ToString());

            staff.HoTen = request.HoTen;
            staff.Email = request.Email;
            staff.SoDienThoai = request.SoDienThoai;
            staff.Role = request.Role;
            staff.ModifiedBy = callerEmail;
            staff.ModifiedOn = DateTime.UtcNow;

            if (!string.IsNullOrEmpty(request.Password))
                staff.Password = new PasswordHasher<Staff>().HashPassword(staff, request.Password);

            await _nhanVienRepo.EditAsync(staff);

            return result.BuildResult(StaffMapper.ToResponse(staff), "Cập nhật nhân viên thành công.");
        }
    }
}
