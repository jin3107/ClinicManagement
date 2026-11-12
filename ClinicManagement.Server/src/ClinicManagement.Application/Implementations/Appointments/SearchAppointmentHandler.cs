using ClinicManagement.Application.Interfaces.Identity;
using LinqKit;
using MayNghien.Infrastructures.Models.Requests;
using MayNghien.Infrastructures.Models.Responses;
using Microsoft.EntityFrameworkCore;
using ClinicManagement.Application.Interfaces.Appointments;
using ClinicManagement.Application.Interfaces.Repositories;
using ClinicManagement.Application.Mapping;
using ClinicManagement.Domain.Entities;
using ClinicManagement.DTOs.Responses;
using static MayNghien.Infrastructures.Helpers.SearchHelper;

namespace ClinicManagement.Application.Implementations.Appointments
{
    public class SearchAppointmentHandler : ISearchAppointmentHandler
    {
        private readonly IAppointmentRepository _lichHenRepo;

        private readonly IPatientScopeService _patientScope;

        public SearchAppointmentHandler(IAppointmentRepository lichHenRepo, IPatientScopeService patientScope)
        {
            _patientScope = patientScope;
            _lichHenRepo = lichHenRepo;
        }

        public async Task<AppResponse<SearchResponse<LichHenResponse>>> HandleAsync(SearchRequest request)
        {
            var result = new AppResponse<SearchResponse<LichHenResponse>>();

            var query = BuildFilterExpression(request.Filters!);
            var pid = await _patientScope.GetRestrictedPatientIdAsync();
            query = query.And(x => pid == null || x.MaBN == pid);
            var numOfRecords = await _lichHenRepo.CountRecordsAsync(query);
            var entities = _lichHenRepo.FindBy(query).AsQueryable();

            if (request.SortBy != null)
                entities = _lichHenRepo.AddSort(entities, request.SortBy);
            else
                entities = entities.OrderBy(x => x.ThoiGianKham);

            int pageIndex = request.PageIndex ?? 1;
            int pageSize = request.PageSize ?? 10;
            int startIndex = (pageIndex - 1) * pageSize;
            var list = await entities.Skip(startIndex).Take(pageSize).ToListAsync();

            return result.BuildResult(new SearchResponse<LichHenResponse>
            {
                TotalPages = CalculateNumOfPages(numOfRecords, pageSize),
                TotalRows = numOfRecords,
                CurrentPage = pageIndex,
                Data = list.Select(AppointmentMapper.ToResponse).ToList(),
                RowsPerPage = pageSize,
            });
        }

        private static ExpressionStarter<Appointment> BuildFilterExpression(List<Filter> filters)
        {
            var predicate = PredicateBuilder.New<Appointment>(true);
            if (filters != null)
            {
                foreach (var filter in filters)
                {
                    switch (filter.FieldName)
                    {
                        case "TrangThai":
                            if (!string.IsNullOrEmpty(filter.Value))
                                predicate = predicate.And(x => x.TrangThai.Contains(filter.Value));
                            break;
                        case "Thời gian khám":
                            if (!string.IsNullOrEmpty(filter.Value) && DateTime.TryParse(filter.Value, out var thoiGianKham))
                                predicate = predicate.And(x => x.ThoiGianKham >= thoiGianKham.Date && x.ThoiGianKham < thoiGianKham.Date.AddDays(1));
                            break;
                    }
                }
            }
            predicate = predicate.And(x => x.IsDeleted == false);
            return predicate;
        }
    }
}
