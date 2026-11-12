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
    public class CreateDoctorHandler : ICreateDoctorHandler
    {
        private readonly IDoctorRepository _bacSiRepository;
        private readonly IIdentityUserService _identityUserService;
        private readonly ICurrentUserService _currentUser;

        public CreateDoctorHandler(IDoctorRepository bacSiRepository,
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

            if (string.IsNullOrWhiteSpace(request.Password))
                return result.BuildError("Mật khẩu là bắt buộc khi tạo bác sĩ.");

            if (await _identityUserService.UserExistsAsync(request.Email, request.SoDienThoai!))
                return result.BuildError("Email hoặc số điện thoại của bác sĩ đã tồn tại.");

            var (createResult, userId) = await _identityUserService.CreateUserAsync(
                request.Email, request.SoDienThoai, request.HoTen, request.Password!, Role.BacSi);

            if (!createResult.Succeeded || userId == null)
                return result.BuildError("Không thể tạo người dùng: "
                    + string.Join(", ", createResult.Errors.Select(e => e.Description)));

            var bacSi = DoctorMapper.ToEntity(request);
            bacSi.MaBS = Guid.NewGuid();
            bacSi.MaTK = userId;
            bacSi.CreatedBy = callerEmail;
            bacSi.CreatedOn = DateTime.UtcNow;
            bacSi.IsDeleted = false;

            try
            {
                await _identityUserService.AssignRoleAsync(userId, Role.BacSi.ToString());
                await _bacSiRepository.AddAsync(bacSi);
            }
            catch
            {
                await _identityUserService.DeleteUserAsync(userId);
                throw;
            }

            var response = DoctorMapper.ToResponse(bacSi, request.Email);
            return result.BuildResult(response, "Đã tạo thông tin bác sĩ thành công.");
        }
    }
}
