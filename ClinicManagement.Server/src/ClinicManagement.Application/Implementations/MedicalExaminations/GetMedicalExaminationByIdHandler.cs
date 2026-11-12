using ClinicManagement.Application.Interfaces.Identity;
using MayNghien.Infrastructures.Models.Responses;
using Microsoft.EntityFrameworkCore;
using ClinicManagement.Application.Interfaces.MedicalExaminations;
using ClinicManagement.Application.Interfaces.Repositories;
using ClinicManagement.Application.Mapping;
using ClinicManagement.DTOs.Responses;

namespace ClinicManagement.Application.Implementations.MedicalExaminations
{
    public class GetMedicalExaminationByIdHandler : IGetMedicalExaminationByIdHandler
    {
        private readonly IMedicalExaminationRepository _repo;

        private readonly IPatientScopeService _patientScope;

        public GetMedicalExaminationByIdHandler(IMedicalExaminationRepository repo, IPatientScopeService patientScope)
        {
            _patientScope = patientScope;
            _repo = repo;
        }

        public async Task<AppResponse<PhieuKhamResponse>> HandleAsync(Guid id)
        {
            var result = new AppResponse<PhieuKhamResponse>();

            var pid = await _patientScope.GetRestrictedPatientIdAsync();
            var entity = await _repo.FindBy(x => x.MaPK == id && x.IsDeleted == false)
                .Where(x => pid == null || x.Appointment!.MaBN == pid)
                .Include(x => x.Doctor)
                .Include(x => x.Appointment!).ThenInclude(l => l.Patient)
                .FirstOrDefaultAsync();
            if (entity == null)
                return result.BuildError("Thông tin phiếu khám không tồn tại.");

            return result.BuildResult(MedicalExaminationMapper.ToResponse(entity));
        }
    }
}
