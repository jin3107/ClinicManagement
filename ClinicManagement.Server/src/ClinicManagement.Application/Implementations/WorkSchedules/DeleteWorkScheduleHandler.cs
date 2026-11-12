using MayNghien.Infrastructures.Models.Responses;
using ClinicManagement.Application.Interfaces.Identity;
using ClinicManagement.Application.Interfaces.WorkSchedules;
using ClinicManagement.Application.Interfaces.Repositories;

namespace ClinicManagement.Application.Implementations.WorkSchedules
{
    public class DeleteWorkScheduleHandler : IDeleteWorkScheduleHandler
    {
        private readonly IWorkScheduleRepository _repo;
        private readonly ICurrentUserService _currentUser;

        public DeleteWorkScheduleHandler(IWorkScheduleRepository repo, ICurrentUserService currentUser)
        {
            _repo = repo;
            _currentUser = currentUser;
        }

        public async Task<AppResponse<string>> HandleAsync(Guid id)
        {
            var result = new AppResponse<string>();

            var callerEmail = _currentUser.GetEmail();
            if (callerEmail == null)
                return result.BuildError("Unauthorized");

            var entity = await _repo.GetAsync(id);
            if (entity == null || entity.IsDeleted == true)
                return result.BuildError("Thông tin lịch làm việc không tồn tại.");

            entity.IsDeleted = true;
            entity.ModifiedBy = callerEmail;
            entity.ModifiedOn = DateTime.UtcNow;
            await _repo.EditAsync(entity);

            return result.BuildResult("Đã xóa thông tin lịch làm việc thành công.");
        }
    }
}
