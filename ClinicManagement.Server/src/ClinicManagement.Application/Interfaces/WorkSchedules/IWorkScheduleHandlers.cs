using MayNghien.Infrastructures.Models.Requests;
using MayNghien.Infrastructures.Models.Responses;
using ClinicManagement.DTOs.Requests;
using ClinicManagement.DTOs.Responses;

namespace ClinicManagement.Application.Interfaces.WorkSchedules
{
    public interface ICreateWorkScheduleHandler
    {
        Task<AppResponse<LichLamViecResponse>> HandleAsync(LichLamViecRequest request);
    }

    public interface IUpdateWorkScheduleHandler
    {
        Task<AppResponse<LichLamViecResponse>> HandleAsync(LichLamViecRequest request);
    }

    public interface IDeleteWorkScheduleHandler
    {
        Task<AppResponse<string>> HandleAsync(Guid id);
    }

    public interface IGetWorkScheduleByIdHandler
    {
        Task<AppResponse<LichLamViecResponse>> HandleAsync(Guid id);
    }

    public interface ISearchWorkScheduleHandler
    {
        Task<AppResponse<SearchResponse<LichLamViecResponse>>> HandleAsync(SearchRequest request);
    }
}
