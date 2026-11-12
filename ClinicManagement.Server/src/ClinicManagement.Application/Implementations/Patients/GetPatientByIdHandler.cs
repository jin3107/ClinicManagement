using ClinicManagement.Application.Interfaces.Identity;
using MayNghien.Infrastructures.Models.Responses;
using Microsoft.EntityFrameworkCore;
using ClinicManagement.Application.Interfaces.Patients;
using ClinicManagement.Application.Interfaces.Repositories;
using ClinicManagement.Application.Mapping;
using ClinicManagement.DTOs.Responses;

namespace ClinicManagement.Application.Implementations.Patients
{
    public class GetPatientByIdHandler : IGetPatientByIdHandler
    {
        private readonly IPatientRepository _benhNhanRepository;

        private readonly IPatientScopeService _patientScope;

        public GetPatientByIdHandler(IPatientRepository benhNhanRepository, IPatientScopeService patientScope)
        {
            _patientScope = patientScope;
            _benhNhanRepository = benhNhanRepository;
        }

        public async Task<AppResponse<BenhNhanResponse>> HandleAsync(Guid id)
        {
            var result = new AppResponse<BenhNhanResponse>();

            var pid = await _patientScope.GetRestrictedPatientIdAsync();
            var entity = await _benhNhanRepository.FindBy(x => x.MaBN == id && x.IsDeleted == false)
                .Where(x => pid == null || x.MaBN == pid)
                .FirstOrDefaultAsync();
            if (entity == null)
                return result.BuildError("Thông tin bệnh nhân không tồn tại.");

            return result.BuildResult(PatientMapper.ToResponse(entity));
        }
    }
}
