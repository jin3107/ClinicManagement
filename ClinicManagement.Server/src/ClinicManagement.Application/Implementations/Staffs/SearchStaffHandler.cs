using LinqKit;
using MayNghien.Infrastructures.Models.Requests;
using MayNghien.Infrastructures.Models.Responses;
using Microsoft.EntityFrameworkCore;
using ClinicManagement.Application.Interfaces.Staffs;
using ClinicManagement.Application.Interfaces.Repositories;
using ClinicManagement.Application.Mapping;
using ClinicManagement.Domain.Entities;
using ClinicManagement.DTOs.Responses;
using static MayNghien.Infrastructures.Helpers.SearchHelper;

namespace ClinicManagement.Application.Implementations.Staffs
{
    public class SearchStaffHandler : ISearchStaffHandler
    {
        private readonly IStaffRepository _nhanVienRepo;

        public SearchStaffHandler(IStaffRepository nhanVienRepo)
        {
            _nhanVienRepo = nhanVienRepo;
        }

        public async Task<AppResponse<SearchResponse<NhanVienResponse>>> HandleAsync(SearchRequest request)
        {
            var result = new AppResponse<SearchResponse<NhanVienResponse>>();

            var query = BuildFilterExpression(request.Filters!);
            var numOfRecords = await _nhanVienRepo.CountRecordsAsync(query);
            var staffs = _nhanVienRepo.FindBy(query).AsQueryable();

            if (request.SortBy != null)
                staffs = _nhanVienRepo.AddSort(staffs, request.SortBy);
            else
                staffs = staffs.OrderBy(x => x.HoTen);

            int pageIndex = request.PageIndex ?? 1;
            int pageSize = request.PageSize ?? 10;
            int startIndex = (pageIndex - 1) * pageSize;
            var list = await staffs.Skip(startIndex).Take(pageSize).ToListAsync();

            return result.BuildResult(new SearchResponse<NhanVienResponse>
            {
                TotalPages = CalculateNumOfPages(numOfRecords, pageSize),
                TotalRows = numOfRecords,
                CurrentPage = pageIndex,
                Data = list.Select(StaffMapper.ToResponse).ToList(),
                RowsPerPage = pageSize,
            });
        }

        private static ExpressionStarter<Staff> BuildFilterExpression(List<Filter> filters)
        {
            var predicate = PredicateBuilder.New<Staff>(true);
            if (filters != null)
            {
                foreach (var filter in filters)
                {
                    switch (filter.FieldName)
                    {
                        case "Name":
                            if (!string.IsNullOrEmpty(filter.Value))
                                predicate = predicate.And(x => x.HoTen.Contains(filter.Value));
                            break;
                        case "Email":
                            if (!string.IsNullOrEmpty(filter.Value))
                                predicate = predicate.And(x => x.Email.Contains(filter.Value));
                            break;
                        case "PhoneNumber":
                            if (!string.IsNullOrEmpty(filter.Value))
                                predicate = predicate.And(x => x.SoDienThoai!.Contains(filter.Value));
                            break;
                        case "Role":
                            if (!string.IsNullOrEmpty(filter.Value))
                                predicate = predicate.And(x => x.Role.Contains(filter.Value));
                            break;
                    }
                }
            }
            predicate = predicate.And(x => x.IsDeleted == false);
            return predicate;
        }
    }
}
