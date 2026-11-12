using LinqKit;
using MayNghien.Infrastructures.Models.Requests;
using MayNghien.Infrastructures.Models.Responses;
using Microsoft.EntityFrameworkCore;
using ClinicManagement.Application.Interfaces.WorkSchedules;
using ClinicManagement.Application.Interfaces.Repositories;
using ClinicManagement.Application.Mapping;
using ClinicManagement.Domain.Entities;
using ClinicManagement.DTOs.Responses;
using static MayNghien.Infrastructures.Helpers.SearchHelper;

namespace ClinicManagement.Application.Implementations.WorkSchedules
{
    public class SearchWorkScheduleHandler : ISearchWorkScheduleHandler
    {
        private readonly IWorkScheduleRepository _repo;

        public SearchWorkScheduleHandler(IWorkScheduleRepository repo)
        {
            _repo = repo;
        }

        public async Task<AppResponse<SearchResponse<LichLamViecResponse>>> HandleAsync(SearchRequest request)
        {
            var result = new AppResponse<SearchResponse<LichLamViecResponse>>();

            var query = BuildFilterExpression(request.Filters!);
            var numOfRecords = await _repo.CountRecordsAsync(query);
            var entities = _repo.FindBy(query).Include(x => x.Doctor).AsQueryable();

            if (request.SortBy != null)
                entities = _repo.AddSort(entities, request.SortBy);
            else
                entities = entities.OrderBy(x => x.NgayLamViec);

            int pageIndex = request.PageIndex ?? 1;
            int pageSize = request.PageSize ?? 10;
            int startIndex = (pageIndex - 1) * pageSize;
            var list = await entities.Skip(startIndex).Take(pageSize).ToListAsync();

            return result.BuildResult(new SearchResponse<LichLamViecResponse>
            {
                TotalPages = CalculateNumOfPages(numOfRecords, pageSize),
                TotalRows = numOfRecords,
                CurrentPage = pageIndex,
                RowsPerPage = pageSize,
                Data = list.Select(WorkScheduleMapper.ToResponse).ToList(),
            });
        }

        private static ExpressionStarter<WorkSchedule> BuildFilterExpression(List<Filter> filters)
        {
            var predicate = PredicateBuilder.New<WorkSchedule>(true);
            if (filters != null)
            {
                foreach (var filter in filters)
                {
                    switch (filter.FieldName)
                    {
                        case "Ngày làm việc":
                            if (!string.IsNullOrEmpty(filter.Value) && DateTime.TryParse(filter.Value, out var ngay))
                                predicate = predicate.And(x => x.NgayLamViec >= ngay.Date && x.NgayLamViec < ngay.Date.AddDays(1));
                            break;
                    }
                }
            }
            predicate = predicate.And(x => x.IsDeleted == false);
            return predicate;
        }
    }
}
