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

        public GetMedicalExaminationServicesByExamHandler(IMedicalExaminationServiceRepository repo)
        {
            _repo = repo;
        }

        public async Task<AppResponse<List<PhieuKhamDichVuResponse>>> HandleAsync(Guid maPK)
        {
            var result = new AppResponse<List<PhieuKhamDichVuResponse>>();

            var entities = await _repo
                .FindBy(x => x.MaPK == maPK && x.IsDeleted == false)
                .Include(x => x.MedicalService)
                .ToListAsync();

            return result.BuildResult(entities.Select(MedicalExaminationServiceMapper.ToResponse).ToList());
        }
    }
}
