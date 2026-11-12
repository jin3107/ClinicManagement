using MayNghien.Infrastructures.Models.Requests;
using MayNghien.Infrastructures.Models.Responses;
using ClinicManagement.DTOs.Requests;
using ClinicManagement.DTOs.Responses;

namespace ClinicManagement.Application.Interfaces.Medicines
{
    public interface ICreateMedicineHandler
    {
        Task<AppResponse<DanhMucThuocResponse>> HandleAsync(DanhMucThuocRequest request);
    }

    public interface IUpdateMedicineHandler
    {
        Task<AppResponse<DanhMucThuocResponse>> HandleAsync(DanhMucThuocRequest request);
    }

    public interface IDeleteMedicineHandler
    {
        Task<AppResponse<string>> HandleAsync(Guid id);
    }

    public interface IGetMedicineByIdHandler
    {
        Task<AppResponse<DanhMucThuocResponse>> HandleAsync(Guid id);
    }

    public interface ISearchMedicineHandler
    {
        Task<AppResponse<SearchResponse<DanhMucThuocResponse>>> HandleAsync(SearchRequest request);
    }
}
