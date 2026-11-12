using MayNghien.Infrastructures.Models.Responses;
using ClinicManagement.Application.Interfaces.Doctors;
using ClinicManagement.Application.Interfaces.Identity;
using ClinicManagement.Application.Interfaces.Repositories;

namespace ClinicManagement.Application.Implementations.Doctors
{
    public class DeleteDoctorHandler : IDeleteDoctorHandler
    {
        private readonly IDoctorRepository _bacSiRepository;
        private readonly IIdentityUserService _identityUserService;
        private readonly ICurrentUserService _currentUser;

        public DeleteDoctorHandler(IDoctorRepository bacSiRepository,
            IIdentityUserService identityUserService, ICurrentUserService currentUser)
        {
            _bacSiRepository = bacSiRepository;
            _identityUserService = identityUserService;
            _currentUser = currentUser;
        }

        public async Task<AppResponse<string>> HandleAsync(Guid id)
        {
            var result = new AppResponse<string>();

            var callerEmail = _currentUser.GetEmail();
            if (callerEmail == null)
                return result.BuildError("Unauthorized");

            var bacSi = await _bacSiRepository.GetAsync(id);
            if (bacSi == null || bacSi.IsDeleted == true)
                return result.BuildError("Thông tin bác sĩ không tồn tại hoặc đã bị xóa.");

            bacSi.IsDeleted = true;
            bacSi.ModifiedBy = callerEmail;
            bacSi.ModifiedOn = DateTime.UtcNow;

            if (!string.IsNullOrEmpty(bacSi.MaTK))
                await _identityUserService.DeleteUserAsync(bacSi.MaTK);

            await _bacSiRepository.EditAsync(bacSi);

            return result.BuildResult("Đã xóa thông tin bác sĩ thành công.");
        }
    }
}
