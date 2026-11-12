using ClinicManagement.Application.Interfaces.Identity;
using LinqKit;
using MayNghien.Infrastructures.Models.Requests;
using MayNghien.Infrastructures.Models.Responses;
using Microsoft.EntityFrameworkCore;
using ClinicManagement.Application.Interfaces.Patients;
using ClinicManagement.Application.Interfaces.Repositories;
using ClinicManagement.Application.Mapping;
using ClinicManagement.Domain.Entities;
using ClinicManagement.DTOs.Responses;
using static MayNghien.Infrastructures.Helpers.SearchHelper;

namespace ClinicManagement.Application.Implementations.Patients
{
    public class SearchPatientHandler : ISearchPatientHandler
    {
        private readonly IPatientRepository _benhNhanRepository;

        private readonly IPatientScopeService _patientScope;

        public SearchPatientHandler(IPatientRepository benhNhanRepository, IPatientScopeService patientScope)
        {
            _patientScope = patientScope;
            _benhNhanRepository = benhNhanRepository;
        }

        public async Task<AppResponse<SearchResponse<BenhNhanResponse>>> HandleAsync(SearchRequest request)
        {
            var result = new AppResponse<SearchResponse<BenhNhanResponse>>();

            var query = BuildFilterExpression(request.Filters!);
            var pid = await _patientScope.GetRestrictedPatientIdAsync();
            query = query.And(x => pid == null || x.MaBN == pid);
            var numOfRecords = await _benhNhanRepository.CountRecordsAsync(query);
            var entities = _benhNhanRepository.FindBy(query).AsQueryable();

            if (request.SortBy != null)
                entities = _benhNhanRepository.AddSort(entities, request.SortBy);
            else
                entities = entities.OrderBy(x => x.HoTen);

            int pageIndex = request.PageIndex ?? 1;
            int pageSize = request.PageSize ?? 10;
            int startIndex = (pageIndex - 1) * pageSize;
            var list = await entities.Skip(startIndex).Take(pageSize).ToListAsync();

            return result.BuildResult(new SearchResponse<BenhNhanResponse>
            {
                TotalPages = CalculateNumOfPages(numOfRecords, pageSize),
                TotalRows = numOfRecords,
                CurrentPage = pageIndex,
                RowsPerPage = pageSize,
                Data = list.Select(PatientMapper.ToResponse).ToList(),
            });
        }

        private static ExpressionStarter<Patient> BuildFilterExpression(List<Filter> filters)
        {
            var predicate = PredicateBuilder.New<Patient>(true);
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
                        case "Số điện thoại":
                            if (!string.IsNullOrEmpty(filter.Value))
                                predicate = predicate.And(x => x.SoDienThoai!.Contains(filter.Value));
                            break;
                    }
                }
            }
            predicate = predicate.And(x => x.IsDeleted == false);
            return predicate;
        }
    }
}
