using MayNghien.Infrastructures.Models.Responses;
using ClinicManagement.Application.Interfaces.Patients;
using ClinicManagement.Application.Interfaces.Identity;
using ClinicManagement.Application.Interfaces.Repositories;

namespace ClinicManagement.Application.Implementations.Patients
{
    public class DeletePatientHandler : IDeletePatientHandler
    {
        private readonly IPatientRepository _benhNhanRepository;
        private readonly ICurrentUserService _currentUser;

        public DeletePatientHandler(IPatientRepository benhNhanRepository,
            ICurrentUserService currentUser)
        {
            _benhNhanRepository = benhNhanRepository;
            _currentUser = currentUser;
        }

        public async Task<AppResponse<string>> HandleAsync(Guid id)
        {
            var result = new AppResponse<string>();

            var callerEmail = _currentUser.GetEmail();
            if (callerEmail == null)
                return result.BuildError("Unauthorized");

            var entity = await _benhNhanRepository.GetAsync(id);
            if (entity == null || entity.IsDeleted == true)
                return result.BuildError("Thông tin bệnh nhân không tồn tại.");

            entity.IsDeleted = true;
            entity.ModifiedBy = callerEmail;
            entity.ModifiedOn = DateTime.UtcNow;
            await _benhNhanRepository.EditAsync(entity);

            return result.BuildResult("Đã xóa thông tin bệnh nhân thành công.");
        }
    }
}
