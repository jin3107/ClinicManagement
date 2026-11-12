using MayNghien.Infrastructures.Models.Responses;
using ClinicManagement.Application.Interfaces.Doctors;
using ClinicManagement.Application.Interfaces.Identity;
using ClinicManagement.Application.Interfaces.Repositories;
using ClinicManagement.Application.Mapping;
using ClinicManagement.Commons.Enum;
using ClinicManagement.DTOs.Requests;
using ClinicManagement.DTOs.Responses;

namespace ClinicManagement.Application.Implementations.Doctors
{
    public class UpdateDoctorHandler : IUpdateDoctorHandler
    {
        private readonly IDoctorRepository _bacSiRepository;
        private readonly IIdentityUserService _identityUserService;
        private readonly ICurrentUserService _currentUser;

        public UpdateDoctorHandler(IDoctorRepository bacSiRepository,
            IIdentityUserService identityUserService, ICurrentUserService currentUser)
        {
            _bacSiRepository = bacSiRepository;
            _identityUserService = identityUserService;
            _currentUser = currentUser;
        }

        public async Task<AppResponse<BacSiResponse>> HandleAsync(BacSiRequest request)
        {
            var result = new AppResponse<BacSiResponse>();

            var callerEmail = _currentUser.GetEmail();
            if (callerEmail == null)
                return result.BuildError("Unauthorized");

            var bacSi = await _bacSiRepository.GetAsync(request.MaBS);
            if (bacSi == null || bacSi.IsDeleted == true)
                return result.BuildError("Thông tin bác sĩ không tồn tại hoặc đã bị xóa.");

            string? userId = bacSi.MaTK;
            bool isNewUser = false;

            if (string.IsNullOrEmpty(userId))
            {
                if (string.IsNullOrWhiteSpace(request.Password))
                    return result.BuildError("Bác sĩ chưa có tài khoản. Vui lòng nhập mật khẩu để tạo tài khoản.");

                if (await _identityUserService.UserExistsAsync(request.Email, request.SoDienThoai!))
                    return result.BuildError("Email hoặc số điện thoại đã được sử dụng.");

                var (createResult, newUserId) = await _identityUserService.CreateUserAsync(
                    request.Email, request.SoDienThoai, request.HoTen, request.Password!, Role.BacSi);

                if (!createResult.Succeeded || newUserId == null)
                    return result.BuildError("Không thể tạo người dùng: "
                        + string.Join(", ", createResult.Errors.Select(e => e.Description)));

                userId = newUserId;
                bacSi.MaTK = userId;
                isNewUser = true;
            }
            else
            {
                if (await _identityUserService.UserExistsAsync(request.Email, request.SoDienThoai!, userId))
                    return result.BuildError("Email hoặc số điện thoại đã được sử dụng.");
            }

            bacSi.HoTen = request.HoTen;
            bacSi.ChuyenKhoa = request.ChuyenKhoa;
            bacSi.SoDienThoai = request.SoDienThoai;
            bacSi.ModifiedBy = callerEmail;
            bacSi.ModifiedOn = DateTime.UtcNow;

            var updateResult = await _identityUserService.UpdateUserAsync(
                userId, request.Email, request.SoDienThoai, request.HoTen, Role.BacSi, request.Password);

            if (!updateResult.Succeeded)
                return result.BuildError("Cập nhật người dùng thất bại: "
                    + string.Join(", ", updateResult.Errors.Select(e => e.Description)));

            try
            {
                await _identityUserService.AssignRoleAsync(userId, Role.BacSi.ToString());
                await _bacSiRepository.EditAsync(bacSi);
            }
            catch
            {
                if (isNewUser) await _identityUserService.DeleteUserAsync(userId);
                throw;
            }

            var email = await _identityUserService.GetEmailByIdAsync(userId);
            var response = DoctorMapper.ToResponse(bacSi, email ?? request.Email);
            return result.BuildResult(response, "Đã cập nhật thông tin bác sĩ thành công.");
        }
    }
}
