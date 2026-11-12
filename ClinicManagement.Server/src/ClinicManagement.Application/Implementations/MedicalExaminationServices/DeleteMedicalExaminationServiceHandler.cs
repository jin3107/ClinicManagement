using MayNghien.Infrastructures.Models.Responses;
using ClinicManagement.Application.Interfaces.Identity;
using ClinicManagement.Application.Interfaces.MedicalExaminationServices;
using ClinicManagement.Application.Interfaces.Repositories;

namespace ClinicManagement.Application.Implementations.MedicalExaminationServices
{
    public class DeleteMedicalExaminationServiceHandler : IDeleteMedicalExaminationServiceHandler
    {
        private readonly IMedicalExaminationServiceRepository _repo;
        private readonly ICurrentUserService _currentUser;

        public DeleteMedicalExaminationServiceHandler(
            IMedicalExaminationServiceRepository repo, ICurrentUserService currentUser)
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
            if (entity == null || entity.IsDeleted)
                return result.BuildError("Không tìm thấy dịch vụ đã chỉ định.");

            entity.IsDeleted = true;
            entity.ModifiedBy = callerEmail;
            entity.ModifiedOn = DateTime.UtcNow;
            await _repo.EditAsync(entity);

            return result.BuildResult("Đã xoá dịch vụ khỏi phiếu khám.");
        }
    }
}
