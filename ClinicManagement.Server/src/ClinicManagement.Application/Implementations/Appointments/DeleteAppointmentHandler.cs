using MayNghien.Infrastructures.Models.Responses;
using ClinicManagement.Application.Interfaces.Identity;
using ClinicManagement.Application.Interfaces.Appointments;
using ClinicManagement.Application.Interfaces.Repositories;

namespace ClinicManagement.Application.Implementations.Appointments
{
    public class DeleteAppointmentHandler : IDeleteAppointmentHandler
    {
        private readonly IAppointmentRepository _lichHenRepo;
        private readonly ICurrentUserService _currentUser;

        public DeleteAppointmentHandler(IAppointmentRepository lichHenRepo, ICurrentUserService currentUser)
        {
            _lichHenRepo = lichHenRepo;
            _currentUser = currentUser;
        }

        public async Task<AppResponse<string>> HandleAsync(Guid id)
        {
            var result = new AppResponse<string>();

            var callerEmail = _currentUser.GetEmail();
            if (callerEmail == null)
                return result.BuildError("Unauthorized");

            var lichHen = await _lichHenRepo.GetAsync(id);
            if (lichHen == null || lichHen.IsDeleted == true)
                return result.BuildError("Thông tin lịch hẹn không tồn tại hoặc đã bị xóa.");

            lichHen.IsDeleted = true;
            lichHen.ModifiedBy = callerEmail;
            lichHen.ModifiedOn = DateTime.UtcNow;
            await _lichHenRepo.EditAsync(lichHen);

            return result.BuildResult("Đã xóa thông tin lịch hẹn thành công.");
        }
    }
}
