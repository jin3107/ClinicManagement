using ClinicManagement.Application.Interfaces.Identity;
using MayNghien.Infrastructures.Models.Responses;
using Microsoft.EntityFrameworkCore;
using ClinicManagement.Application.Interfaces.MedicalExaminationServices;
using ClinicManagement.Application.Interfaces.Repositories;
using ClinicManagement.Application.Mapping;
using ClinicManagement.DTOs.Responses;

namespace ClinicManagement.Application.Implementations.MedicalExaminationServices
{
    public class GetMedicalExaminationServicesByExamHandler : IGetMedicalExaminationServicesByExamHandler
    {
        private readonly IMedicalExaminationServiceRepository _repo;

        private readonly IPatientScopeService _patientScope;

        public GetMedicalExaminationServicesByExamHandler(IMedicalExaminationServiceRepository repo, IPatientScopeService patientScope)
        {
            _patientScope = patientScope;
            _repo = repo;
        }

        public async Task<AppResponse<List<PhieuKhamDichVuResponse>>> HandleAsync(Guid maPK)
        {
            var result = new AppResponse<List<PhieuKhamDichVuResponse>>();

            var pid = await _patientScope.GetRestrictedPatientIdAsync();
            var entities = await _repo
                .FindBy(x => x.MaPK == maPK && x.IsDeleted == false)
                .Where(x => pid == null || x.MedicalExamination!.Appointment!.MaBN == pid)
                .Include(x => x.MedicalService)
                .ToListAsync();

            return result.BuildResult(entities.Select(MedicalExaminationServiceMapper.ToResponse).ToList());
        }
    }
}
