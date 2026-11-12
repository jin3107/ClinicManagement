using LinqKit;
using MayNghien.Infrastructures.Models.Requests;
using MayNghien.Infrastructures.Models.Responses;
using Microsoft.EntityFrameworkCore;
using ClinicManagement.Application.Interfaces.Invoices;
using ClinicManagement.Application.Interfaces.Repositories;
using ClinicManagement.Application.Mapping;
using ClinicManagement.Domain.Entities;
using ClinicManagement.DTOs.Responses;
using static MayNghien.Infrastructures.Helpers.SearchHelper;

namespace ClinicManagement.Application.Implementations.Invoices
{
    public class SearchInvoiceHandler : ISearchInvoiceHandler
    {
        private readonly IInvoiceRepository _hoaDonRepo;

        public SearchInvoiceHandler(IInvoiceRepository hoaDonRepo)
        {
            _hoaDonRepo = hoaDonRepo;
        }

        public async Task<AppResponse<SearchResponse<HoaDonResponse>>> HandleAsync(SearchRequest request)
        {
            var result = new AppResponse<SearchResponse<HoaDonResponse>>();

            var query = BuildFilterExpression(request.Filters!);
            var numOfRecords = await _hoaDonRepo.CountRecordsAsync(query);
            var entities = _hoaDonRepo.FindBy(query)
                .Include(x => x.MedicalExamination!).ThenInclude(p => p.Appointment!).ThenInclude(l => l.Patient)
                .AsQueryable();

            if (request.SortBy != null)
                entities = _hoaDonRepo.AddSort(entities, request.SortBy);
            else
                entities = entities.OrderByDescending(x => x.NgayThanhToan);

            int pageIndex = request.PageIndex ?? 1;
            int pageSize = request.PageSize ?? 10;
            int startIndex = (pageIndex - 1) * pageSize;
            var list = await entities.Skip(startIndex).Take(pageSize).ToListAsync();

            return result.BuildResult(new SearchResponse<HoaDonResponse>
            {
                TotalPages = CalculateNumOfPages(numOfRecords, pageSize),
                TotalRows = numOfRecords,
                CurrentPage = pageIndex,
                RowsPerPage = pageSize,
                Data = list.Select(InvoiceMapper.ToResponse).ToList(),
            });
        }

        private static ExpressionStarter<Invoice> BuildFilterExpression(List<Filter> filters)
        {
            var predicate = PredicateBuilder.New<Invoice>(true);
            if (filters != null)
            {
                foreach (var filter in filters)
                {
                    switch (filter.FieldName)
                    {
                        case "Trang thái thanh toán":
                            if (!string.IsNullOrEmpty(filter.Value))
                                predicate = predicate.And(x => x.TrangThaiThanhToan!.Contains(filter.Value));
                            break;
                        case "Ngày thanh toán":
                            if (!string.IsNullOrEmpty(filter.Value) && DateTime.TryParse(filter.Value, out var ngay))
                                predicate = predicate.And(x => x.NgayThanhToan >= ngay.Date && x.NgayThanhToan < ngay.Date.AddDays(1));
                            break;
                    }
                }
            }
            predicate = predicate.And(x => x.IsDeleted == false);
            return predicate;
        }
    }
}
