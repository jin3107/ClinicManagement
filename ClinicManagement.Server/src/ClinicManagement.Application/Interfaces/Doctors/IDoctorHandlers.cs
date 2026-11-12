using MayNghien.Infrastructures.Models.Requests;
using MayNghien.Infrastructures.Models.Responses;
using ClinicManagement.DTOs.Requests;
using ClinicManagement.DTOs.Responses;

namespace ClinicManagement.Application.Interfaces.Doctors
{
    public interface ICreateDoctorHandler
    {
        Task<AppResponse<BacSiResponse>> HandleAsync(BacSiRequest request);
    }

    public interface IUpdateDoctorHandler
    {
        Task<AppResponse<BacSiResponse>> HandleAsync(BacSiRequest request);
    }

    public interface IDeleteDoctorHandler
    {
        Task<AppResponse<string>> HandleAsync(Guid id);
    }

    public interface IGetDoctorByIdHandler
    {
        Task<AppResponse<BacSiResponse>> HandleAsync(Guid id);
    }

    public interface ISearchDoctorHandler
    {
        Task<AppResponse<SearchResponse<BacSiResponse>>> HandleAsync(SearchRequest request);
    }
}
