using MayNghien.Infrastructures.Models.Requests;
using MayNghien.Infrastructures.Models.Responses;
using ClinicManagement.DTOs.Requests;
using ClinicManagement.DTOs.Responses;

namespace ClinicManagement.Application.Interfaces.MedicalServices
{
    public interface ICreateMedicalServiceHandler
    {
        Task<AppResponse<DanhMucDichVuResponse>> HandleAsync(DanhMucDichVuRequest request);
    }

    public interface IUpdateMedicalServiceHandler
    {
        Task<AppResponse<DanhMucDichVuResponse>> HandleAsync(DanhMucDichVuRequest request);
    }

    public interface IDeleteMedicalServiceHandler
    {
        Task<AppResponse<string>> HandleAsync(Guid id);
    }

    public interface IGetMedicalServiceByIdHandler
    {
        Task<AppResponse<DanhMucDichVuResponse>> HandleAsync(Guid id);
    }

    public interface ISearchMedicalServiceHandler
    {
        Task<AppResponse<SearchResponse<DanhMucDichVuResponse>>> HandleAsync(SearchRequest request);
    }
}
