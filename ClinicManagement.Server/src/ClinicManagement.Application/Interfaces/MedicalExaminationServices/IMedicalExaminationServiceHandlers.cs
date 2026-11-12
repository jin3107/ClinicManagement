using MayNghien.Infrastructures.Models.Responses;
using ClinicManagement.DTOs.Requests;
using ClinicManagement.DTOs.Responses;

namespace ClinicManagement.Application.Interfaces.MedicalExaminationServices
{
    public interface ICreateMedicalExaminationServiceHandler
    {
        Task<AppResponse<List<PhieuKhamDichVuResponse>>> HandleAsync(PhieuKhamDichVuRequest request);
    }

    public interface IGetMedicalExaminationServicesByExamHandler
    {
        Task<AppResponse<List<PhieuKhamDichVuResponse>>> HandleAsync(Guid maPK);
    }

    public interface IDeleteMedicalExaminationServiceHandler
    {
        Task<AppResponse<string>> HandleAsync(Guid id);
    }
}
