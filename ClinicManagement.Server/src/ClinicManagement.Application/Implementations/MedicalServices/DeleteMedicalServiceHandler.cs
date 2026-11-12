using MayNghien.Infrastructures.Models.Responses;
using ClinicManagement.Application.Interfaces.MedicalServices;
using ClinicManagement.Application.Interfaces.Identity;
using ClinicManagement.Application.Interfaces.Repositories;

namespace ClinicManagement.Application.Implementations.MedicalServices
{
    public class DeleteMedicalServiceHandler : IDeleteMedicalServiceHandler
    {
        private readonly IMedicalServiceRepository _repo;
        private readonly ICurrentUserService _currentUser;

        public DeleteMedicalServiceHandler(IMedicalServiceRepository repo, ICurrentUserService currentUser)
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
                return result.BuildError("Thông tin danh mục dịch vụ không tồn tại hoặc đã bị xóa.");

            entity.IsDeleted = true;
            entity.ModifiedBy = callerEmail;
            entity.ModifiedOn = DateTime.UtcNow;
            await _repo.EditAsync(entity);

            return result.BuildResult("Đã xóa thông tin danh mục dịch vụ thành công.");
        }
    }
}
