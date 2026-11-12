using LinqKit;
using MayNghien.Infrastructures.Models.Requests;
using MayNghien.Infrastructures.Models.Responses;
using Microsoft.EntityFrameworkCore;
using ClinicManagement.Application.Interfaces.MedicalExaminations;
using ClinicManagement.Application.Interfaces.Repositories;
using ClinicManagement.Application.Mapping;
using ClinicManagement.Domain.Entities;
using ClinicManagement.DTOs.Responses;
using static MayNghien.Infrastructures.Helpers.SearchHelper;

namespace ClinicManagement.Application.Implementations.MedicalExaminations
{
    public class SearchMedicalExaminationHandler : ISearchMedicalExaminationHandler
    {
        private readonly IMedicalExaminationRepository _repo;

        public SearchMedicalExaminationHandler(IMedicalExaminationRepository repo)
        {
            _repo = repo;
        }

        public async Task<AppResponse<SearchResponse<PhieuKhamResponse>>> HandleAsync(SearchRequest request)
        {
            var result = new AppResponse<SearchResponse<PhieuKhamResponse>>();

            var query = BuildFilterExpression(request.Filters!);
            var numOfRecords = await _repo.CountRecordsAsync(query);
            var entities = _repo.FindBy(query)
                .Include(x => x.Doctor)
                .Include(x => x.Appointment!).ThenInclude(l => l.Patient)
                .AsQueryable();

            if (request.SortBy != null)
                entities = _repo.AddSort(entities, request.SortBy);
            else
                entities = entities.OrderByDescending(x => x.NgayKham);

            int pageIndex = request.PageIndex ?? 1;
            int pageSize = request.PageSize ?? 10;
            int startIndex = (pageIndex - 1) * pageSize;
            var list = await entities.Skip(startIndex).Take(pageSize).ToListAsync();

            return result.BuildResult(new SearchResponse<PhieuKhamResponse>
            {
                TotalPages = CalculateNumOfPages(numOfRecords, pageSize),
                TotalRows = numOfRecords,
                CurrentPage = pageIndex,
                RowsPerPage = pageSize,
                Data = list.Select(MedicalExaminationMapper.ToResponse).ToList(),
            });
        }

        private static ExpressionStarter<MedicalExamination> BuildFilterExpression(List<Filter> filters)
        {
            var predicate = PredicateBuilder.New<MedicalExamination>(true);
            if (filters != null)
            {
                foreach (var filter in filters)
                {
                    switch (filter.FieldName)
                    {
                        case "Trạng thái tiếp nhận":
                            if (!string.IsNullOrEmpty(filter.Value))
                                predicate = predicate.And(x => x.TrangThaiTiepNhan!.Contains(filter.Value));
                            break;
                        case "Ngày khám":
                            if (!string.IsNullOrEmpty(filter.Value) && DateTime.TryParse(filter.Value, out var ngay))
                                predicate = predicate.And(x => x.NgayKham >= ngay.Date && x.NgayKham < ngay.Date.AddDays(1));
                            break;
                    }
                }
            }
            predicate = predicate.And(x => x.IsDeleted == false);
            return predicate;
        }
    }
}
