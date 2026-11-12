using LinqKit;
using MayNghien.Infrastructures.Models.Requests;
using MayNghien.Infrastructures.Models.Responses;
using Microsoft.EntityFrameworkCore;
using ClinicManagement.Application.Interfaces.MedicalServices;
using ClinicManagement.Application.Interfaces.Repositories;
using ClinicManagement.Application.Mapping;
using ClinicManagement.Domain.Entities;
using ClinicManagement.DTOs.Responses;
using static MayNghien.Infrastructures.Helpers.SearchHelper;

namespace ClinicManagement.Application.Implementations.MedicalServices
{
    public class SearchMedicalServiceHandler : ISearchMedicalServiceHandler
    {
        private readonly IMedicalServiceRepository _repo;

        public SearchMedicalServiceHandler(IMedicalServiceRepository repo)
        {
            _repo = repo;
        }

        public async Task<AppResponse<SearchResponse<DanhMucDichVuResponse>>> HandleAsync(SearchRequest request)
        {
            var result = new AppResponse<SearchResponse<DanhMucDichVuResponse>>();

            var query = BuildFilterExpression(request.Filters!);
            var numOfRecords = await _repo.CountRecordsAsync(query);
            var entities = _repo.FindBy(query).AsQueryable();

            if (request.SortBy != null)
                entities = _repo.AddSort(entities, request.SortBy);
            else
                entities = entities.OrderBy(x => x.TenDV);

            int pageIndex = request.PageIndex ?? 1;
            int pageSize = request.PageSize ?? 10;
            int startIndex = (pageIndex - 1) * pageSize;
            var list = await entities.Skip(startIndex).Take(pageSize).ToListAsync();

            return result.BuildResult(new SearchResponse<DanhMucDichVuResponse>
            {
                TotalPages = CalculateNumOfPages(numOfRecords, pageSize),
                TotalRows = numOfRecords,
                CurrentPage = pageIndex,
                Data = list.Select(MedicalServiceMapper.ToResponse).ToList(),
                RowsPerPage = pageSize,
            });
        }

        private static ExpressionStarter<MedicalService> BuildFilterExpression(List<Filter> filters)
        {
            var predicate = PredicateBuilder.New<MedicalService>(true);
            if (filters != null)
            {
                foreach (var filter in filters)
                {
                    switch (filter.FieldName)
                    {
                        case "Tên dịch vụ":
                            if (!string.IsNullOrEmpty(filter.Value))
                                predicate = predicate.And(x => x.TenDV.Contains(filter.Value));
                            break;
                    }
                }
            }
            predicate = predicate.And(x => x.IsDeleted == false);
            return predicate;
        }
    }
}
