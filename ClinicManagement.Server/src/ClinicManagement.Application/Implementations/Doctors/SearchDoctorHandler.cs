using LinqKit;
using MayNghien.Infrastructures.Models.Requests;
using MayNghien.Infrastructures.Models.Responses;
using Microsoft.EntityFrameworkCore;
using ClinicManagement.Application.Interfaces.Doctors;
using ClinicManagement.Application.Interfaces.Identity;
using ClinicManagement.Application.Interfaces.Repositories;
using ClinicManagement.Application.Mapping;
using ClinicManagement.Domain.Entities;
using ClinicManagement.DTOs.Responses;
using static MayNghien.Infrastructures.Helpers.SearchHelper;

namespace ClinicManagement.Application.Implementations.Doctors
{
    public class SearchDoctorHandler : ISearchDoctorHandler
    {
        private readonly IDoctorRepository _bacSiRepository;
        private readonly IIdentityUserService _identityUserService;

        public SearchDoctorHandler(IDoctorRepository bacSiRepository,
            IIdentityUserService identityUserService)
        {
            _bacSiRepository = bacSiRepository;
            _identityUserService = identityUserService;
        }

        public async Task<AppResponse<SearchResponse<BacSiResponse>>> HandleAsync(SearchRequest request)
        {
            var result = new AppResponse<SearchResponse<BacSiResponse>>();

            var query = BuildFilterExpression(request.Filters!);
            var numOfRecords = await _bacSiRepository.CountRecordsAsync(query);
            var bacSiQuery = _bacSiRepository.FindBy(query).AsQueryable();

            if (request.SortBy != null)
                bacSiQuery = _bacSiRepository.AddSort(bacSiQuery, request.SortBy);
            else
                bacSiQuery = bacSiQuery.OrderBy(x => x.HoTen);

            int pageIndex = request.PageIndex ?? 1;
            int pageSize = request.PageSize ?? 10;
            int startIndex = (pageIndex - 1) * pageSize;
            var list = await bacSiQuery.Skip(startIndex).Take(pageSize).ToListAsync();

            var userIds = list.Where(b => !string.IsNullOrEmpty(b.MaTK)).Select(b => b.MaTK!);
            var emailMap = await _identityUserService.GetEmailsByIdsAsync(userIds);

            var dtoList = list.Select(b =>
                DoctorMapper.ToResponse(b, b.MaTK != null && emailMap.TryGetValue(b.MaTK, out var e) ? e : null)
            ).ToList();

            return result.BuildResult(new SearchResponse<BacSiResponse>
            {
                TotalPages = CalculateNumOfPages(numOfRecords, pageSize),
                TotalRows = numOfRecords,
                CurrentPage = pageIndex,
                Data = dtoList,
                RowsPerPage = pageSize,
            });
        }

        private static ExpressionStarter<Doctor> BuildFilterExpression(List<Filter> filters)
        {
            var predicate = PredicateBuilder.New<Doctor>(true);
            if (filters != null)
            {
                foreach (var filter in filters)
                {
                    switch (filter.FieldName)
                    {
                        case "Họ tên":
                            if (!string.IsNullOrEmpty(filter.Value))
                                predicate = predicate.And(x => x.HoTen.Contains(filter.Value));
                            break;
                        case "Chuyên khoa":
                            if (!string.IsNullOrEmpty(filter.Value))
                                predicate = predicate.And(x => x.ChuyenKhoa!.Contains(filter.Value));
                            break;
                    }
                }
            }
            predicate = predicate.And(x => x.IsDeleted == false);
            return predicate;
        }
    }
}
