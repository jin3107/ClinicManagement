using MayNghien.Infrastructures.Models.Requests;
using MayNghien.Infrastructures.Models.Responses;
using ClinicManagement.DTOs.Requests;
using ClinicManagement.DTOs.Responses;

namespace ClinicManagement.Application.Interfaces.Invoices
{
    public interface ICreateInvoiceHandler
    {
        Task<AppResponse<HoaDonResponse>> HandleAsync(HoaDonRequest request);
    }

    public interface IUpdateInvoiceHandler
    {
        Task<AppResponse<HoaDonResponse>> HandleAsync(HoaDonRequest request);
    }

    public interface IDeleteInvoiceHandler
    {
        Task<AppResponse<string>> HandleAsync(Guid id);
    }

    public interface IGetInvoiceByIdHandler
    {
        Task<AppResponse<HoaDonResponse>> HandleAsync(Guid id);
    }

    public interface ISearchInvoiceHandler
    {
        Task<AppResponse<SearchResponse<HoaDonResponse>>> HandleAsync(SearchRequest request);
    }
}
