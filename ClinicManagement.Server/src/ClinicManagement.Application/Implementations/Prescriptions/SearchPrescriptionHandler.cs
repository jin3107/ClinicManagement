using ClinicManagement.Application.Interfaces.Identity;
using LinqKit;
using MayNghien.Infrastructures.Models.Requests;
using MayNghien.Infrastructures.Models.Responses;
using Microsoft.EntityFrameworkCore;
using ClinicManagement.Application.Interfaces.Prescriptions;
using ClinicManagement.Application.Interfaces.Repositories;
using ClinicManagement.Application.Mapping;
using ClinicManagement.Domain.Entities;
using ClinicManagement.DTOs.Responses;
using static MayNghien.Infrastructures.Helpers.SearchHelper;

namespace ClinicManagement.Application.Implementations.Prescriptions
{
    public class SearchPrescriptionHandler : ISearchPrescriptionHandler
    {
        private readonly IPrescriptionRepository _donThuocRepo;

        private readonly IPatientScopeService _patientScope;

        public SearchPrescriptionHandler(IPrescriptionRepository donThuocRepo, IPatientScopeService patientScope)
        {
            _patientScope = patientScope;
            _donThuocRepo = donThuocRepo;
        }

        public async Task<AppResponse<SearchResponse<DonThuocResponse>>> HandleAsync(SearchRequest request)
        {
            var result = new AppResponse<SearchResponse<DonThuocResponse>>();

            var query = BuildFilterExpression(request.Filters!);
            var pid = await _patientScope.GetRestrictedPatientIdAsync();
            query = query.And(x => pid == null || x.MedicalExamination!.Appointment!.MaBN == pid);
            var numOfRecords = await _donThuocRepo.CountRecordsAsync(query);
            var entities = _donThuocRepo.FindBy(query)
                .Include(x => x.PrescriptionDetails!)
                    .ThenInclude(ct => ct.Medicine)
                .AsQueryable();

            if (request.SortBy != null)
                entities = _donThuocRepo.AddSort(entities, request.SortBy);
            else
                entities = entities.OrderByDescending(x => x.NgayKe);

            int pageIndex = request.PageIndex ?? 1;
            int pageSize = request.PageSize ?? 10;
            int startIndex = (pageIndex - 1) * pageSize;
            var list = await entities.Skip(startIndex).Take(pageSize).ToListAsync();

            return result.BuildResult(new SearchResponse<DonThuocResponse>
            {
                TotalPages = CalculateNumOfPages(numOfRecords, pageSize),
                TotalRows = numOfRecords,
                CurrentPage = pageIndex,
                RowsPerPage = pageSize,
                Data = list.Select(PrescriptionMapper.ToResponse).ToList(),
            });
        }

        private static ExpressionStarter<Prescription> BuildFilterExpression(List<Filter> filters)
        {
            var predicate = PredicateBuilder.New<Prescription>(true);
            if (filters != null)
            {
                foreach (var filter in filters)
                {
                    switch (filter.FieldName)
                    {
                        case "Ngày kê":
                            if (!string.IsNullOrEmpty(filter.Value) && DateTime.TryParse(filter.Value, out var ngayKe))
                                predicate = predicate.And(x => x.NgayKe >= ngayKe.Date && x.NgayKe < ngayKe.Date.AddDays(1));
                            break;
                    }
                }
            }
            predicate = predicate.And(x => x.IsDeleted == false);
            return predicate;
        }
    }
}
