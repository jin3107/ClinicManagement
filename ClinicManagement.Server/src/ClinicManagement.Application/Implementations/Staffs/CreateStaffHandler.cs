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
    public class CreateStaffHandler : ICreateStaffHandler
    {
        private readonly IStaffRepository _nhanVienRepo;
        private readonly IIdentityUserService _identityUserService;
        private readonly ICurrentUserService _currentUser;

        public CreateStaffHandler(IStaffRepository nhanVienRepo,
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

            if (await _identityUserService.UserExistsAsync(request.Email, request.SoDienThoai!))
                return result.BuildError("Email hoặc số điện thoại của nhân viên đã tồn tại.");

            if (!Enum.TryParse<Role>(request.Role, out var roleEnum))
                return result.BuildError($"Vai trò '{request.Role}' không hợp lệ.");

            var staff = StaffMapper.ToEntity(request);
            staff.MaNV = Guid.NewGuid();
            staff.CreatedBy = callerEmail;
            staff.CreatedOn = DateTime.UtcNow;
            staff.IsDeleted = false;

            staff.Password = new PasswordHasher<Staff>().HashPassword(staff, request.Password);

            await _nhanVienRepo.AddAsync(staff);

            var (createResult, userId) = await _identityUserService.CreateUserAsync(
                request.Email, request.SoDienThoai, request.HoTen, request.Password, roleEnum);

            if (!createResult.Succeeded || userId == null)
            {
                await _nhanVienRepo.DeleteAsync(staff);
                return result.BuildError("Không thể tạo người dùng: "
                    + string.Join(", ", createResult.Errors.Select(e => e.Description)));
            }

            await _identityUserService.AssignRoleAsync(userId, roleEnum.ToString());

            return result.BuildResult(StaffMapper.ToResponse(staff), "Tạo nhân viên thành công.");
        }
    }
}
