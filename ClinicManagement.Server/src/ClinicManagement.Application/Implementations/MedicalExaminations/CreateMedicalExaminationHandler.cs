using MayNghien.Infrastructures.Models.Responses;
using ClinicManagement.Application.Interfaces.Identity;
using ClinicManagement.Application.Interfaces.MedicalExaminations;
using ClinicManagement.Application.Interfaces.Repositories;
using ClinicManagement.Application.Mapping;
using ClinicManagement.DTOs.Requests;
using ClinicManagement.DTOs.Responses;

namespace ClinicManagement.Application.Implementations.MedicalExaminations
{
    public class CreateMedicalExaminationHandler : ICreateMedicalExaminationHandler
    {
        private readonly IMedicalExaminationRepository _repo;
        private readonly ICurrentUserService _currentUser;

        public CreateMedicalExaminationHandler(IMedicalExaminationRepository repo, ICurrentUserService currentUser)
        {
            _repo = repo;
            _currentUser = currentUser;
        }

        public async Task<AppResponse<PhieuKhamResponse>> HandleAsync(PhieuKhamRequest request)
        {
            var result = new AppResponse<PhieuKhamResponse>();

            var callerEmail = _currentUser.GetEmail();
            if (callerEmail == null)
                return result.BuildError("Unauthorized");

            var entity = MedicalExaminationMapper.ToEntity(request);
            entity.MaPK = Guid.NewGuid();
            entity.CreatedBy = callerEmail;
            entity.CreatedOn = DateTime.UtcNow;
            entity.IsDeleted = false;
            await _repo.AddAsync(entity);

            return result.BuildResult(MedicalExaminationMapper.ToResponse(entity), "Thêm thông tin phiếu khám thành công.");
        }
    }
}
