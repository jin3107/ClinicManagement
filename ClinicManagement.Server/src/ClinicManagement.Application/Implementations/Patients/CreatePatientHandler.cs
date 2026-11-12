using MayNghien.Infrastructures.Models.Responses;
using ClinicManagement.Application.Interfaces.Patients;
using ClinicManagement.Application.Interfaces.Identity;
using ClinicManagement.Application.Interfaces.Repositories;
using ClinicManagement.Application.Mapping;
using ClinicManagement.DTOs.Requests;
using ClinicManagement.DTOs.Responses;

namespace ClinicManagement.Application.Implementations.Patients
{
    public class CreatePatientHandler : ICreatePatientHandler
    {
        private readonly IPatientRepository _benhNhanRepository;
        private readonly ICurrentUserService _currentUser;

        public CreatePatientHandler(IPatientRepository benhNhanRepository,
            ICurrentUserService currentUser)
        {
            _benhNhanRepository = benhNhanRepository;
            _currentUser = currentUser;
        }

        public async Task<AppResponse<BenhNhanResponse>> HandleAsync(BenhNhanRequest request)
        {
            var result = new AppResponse<BenhNhanResponse>();

            var callerEmail = _currentUser.GetEmail();
            if (callerEmail == null)
                return result.BuildError("Unauthorized");

            var entity = PatientMapper.ToEntity(request);
            entity.MaBN = Guid.NewGuid();
            entity.CreatedBy = callerEmail;
            entity.CreatedOn = DateTime.UtcNow;
            entity.IsDeleted = false;
            await _benhNhanRepository.AddAsync(entity);

            return result.BuildResult(PatientMapper.ToResponse(entity), "Thêm thông tin bệnh nhân thành công.");
        }
    }
}
