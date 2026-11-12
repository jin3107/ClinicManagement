using MayNghien.Infrastructures.Models.Requests;
using MayNghien.Infrastructures.Models.Responses;
using ClinicManagement.DTOs.Requests;
using ClinicManagement.DTOs.Responses;

namespace ClinicManagement.Application.Interfaces.MedicalExaminations
{
    public interface ICreateMedicalExaminationHandler
    {
        Task<AppResponse<PhieuKhamResponse>> HandleAsync(PhieuKhamRequest request);
    }

    public interface IUpdateMedicalExaminationHandler
    {
        Task<AppResponse<PhieuKhamResponse>> HandleAsync(PhieuKhamRequest request);
    }

    public interface IDeleteMedicalExaminationHandler
    {
        Task<AppResponse<string>> HandleAsync(Guid id);
    }

    public interface IGetMedicalExaminationByIdHandler
    {
        Task<AppResponse<PhieuKhamResponse>> HandleAsync(Guid id);
    }

    public interface ISearchMedicalExaminationHandler
    {
        Task<AppResponse<SearchResponse<PhieuKhamResponse>>> HandleAsync(SearchRequest request);
    }
}
