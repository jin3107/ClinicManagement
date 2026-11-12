using MayNghien.Infrastructures.Models.Requests;
using MayNghien.Infrastructures.Models.Responses;
using ClinicManagement.DTOs.Requests;
using ClinicManagement.DTOs.Responses;

namespace ClinicManagement.Application.Interfaces.Staffs
{
    public interface ICreateStaffHandler
    {
        Task<AppResponse<NhanVienResponse>> HandleAsync(NhanVienRequest request);
    }

    public interface IUpdateStaffHandler
    {
        Task<AppResponse<NhanVienResponse>> HandleAsync(NhanVienRequest request);
    }

    public interface IDeleteStaffHandler
    {
        Task<AppResponse<string>> HandleAsync(Guid id);
    }

    public interface IGetStaffByIdHandler
    {
        Task<AppResponse<NhanVienResponse>> HandleAsync(Guid id);
    }

    public interface ISearchStaffHandler
    {
        Task<AppResponse<SearchResponse<NhanVienResponse>>> HandleAsync(SearchRequest request);
    }
}
