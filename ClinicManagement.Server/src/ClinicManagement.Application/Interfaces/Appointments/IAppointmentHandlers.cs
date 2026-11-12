using MayNghien.Infrastructures.Models.Requests;
using MayNghien.Infrastructures.Models.Responses;
using ClinicManagement.DTOs.Requests;
using ClinicManagement.DTOs.Responses;

namespace ClinicManagement.Application.Interfaces.Appointments
{
    public interface ICreateAppointmentHandler
    {
        Task<AppResponse<LichHenResponse>> HandleAsync(LichHenRequest request);
    }

    public interface IUpdateAppointmentHandler
    {
        Task<AppResponse<LichHenResponse>> HandleAsync(LichHenRequest request);
    }

    public interface IDeleteAppointmentHandler
    {
        Task<AppResponse<string>> HandleAsync(Guid id);
    }

    public interface IGetAppointmentByIdHandler
    {
        Task<AppResponse<LichHenResponse>> HandleAsync(Guid id);
    }

    public interface ISearchAppointmentHandler
    {
        Task<AppResponse<SearchResponse<LichHenResponse>>> HandleAsync(SearchRequest request);
    }
}
