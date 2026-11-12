using LinqKit;
using MayNghien.Infrastructures.Models.Requests;
using MayNghien.Infrastructures.Models.Responses;
using Microsoft.EntityFrameworkCore;
using ClinicManagement.Application.Interfaces.Medicines;
using ClinicManagement.Application.Interfaces.Repositories;
using ClinicManagement.Application.Mapping;
using ClinicManagement.Domain.Entities;
using ClinicManagement.DTOs.Responses;
using static MayNghien.Infrastructures.Helpers.SearchHelper;

namespace ClinicManagement.Application.Implementations.Medicines
{
    public class SearchMedicineHandler : ISearchMedicineHandler
    {
        private readonly IMedicineRepository _repo;

        public SearchMedicineHandler(IMedicineRepository repo)
        {
            _repo = repo;
        }

        public async Task<AppResponse<SearchResponse<DanhMucThuocResponse>>> HandleAsync(SearchRequest request)
        {
            var result = new AppResponse<SearchResponse<DanhMucThuocResponse>>();

            var query = BuildFilterExpression(request.Filters!);
            var numOfRecords = await _repo.CountRecordsAsync(query);
            var entities = _repo.FindBy(query).OrderBy(x => x.TenThuoc).AsQueryable();

            if (request.SortBy != null)
                entities = _repo.AddSort(entities, request.SortBy);

            int pageIndex = request.PageIndex ?? 1;
            int pageSize = request.PageSize ?? 10;
            int startIndex = (pageIndex - 1) * pageSize;
            var list = await entities.Skip(startIndex).Take(pageSize).ToListAsync();

            return result.BuildResult(new SearchResponse<DanhMucThuocResponse>
            {
                TotalPages = CalculateNumOfPages(numOfRecords, pageSize),
                TotalRows = numOfRecords,
                CurrentPage = pageIndex,
                Data = list.Select(MedicineMapper.ToResponse).ToList(),
                RowsPerPage = pageSize,
            });
        }

        private static ExpressionStarter<Medicine> BuildFilterExpression(List<Filter> filters)
        {
            var predicate = PredicateBuilder.New<Medicine>(true);
            if (filters != null)
            {
                foreach (var filter in filters)
                {
                    switch (filter.FieldName)
                    {
                        case "Tên thuốc":
                            if (!string.IsNullOrEmpty(filter.Value))
                                predicate = predicate.And(x => x.TenThuoc.Contains(filter.Value));
                            break;
                    }
                }
            }
            predicate = predicate.And(x => x.IsDeleted == false);
            return predicate;
        }
    }
}
