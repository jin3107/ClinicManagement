using ClinicManagement.Application.Interfaces.Identity;
using MayNghien.Infrastructures.Models.Responses;
using Microsoft.EntityFrameworkCore;
using ClinicManagement.Application.Interfaces.Appointments;
using ClinicManagement.Application.Interfaces.Repositories;
using ClinicManagement.Application.Mapping;
using ClinicManagement.DTOs.Responses;

namespace ClinicManagement.Application.Implementations.Appointments
{
    public class GetAppointmentByIdHandler : IGetAppointmentByIdHandler
    {
        private readonly IAppointmentRepository _lichHenRepo;

        private readonly IPatientScopeService _patientScope;

        public GetAppointmentByIdHandler(IAppointmentRepository lichHenRepo, IPatientScopeService patientScope)
        {
            _patientScope = patientScope;
            _lichHenRepo = lichHenRepo;
        }

        public async Task<AppResponse<LichHenResponse>> HandleAsync(Guid id)
        {
            var result = new AppResponse<LichHenResponse>();

            var pid = await _patientScope.GetRestrictedPatientIdAsync();
            var lichHen = await _lichHenRepo.FindBy(v => v.MaLH == id && v.IsDeleted == false)
                .Where(v => pid == null || v.MaBN == pid)
                .FirstOrDefaultAsync();
            if (lichHen == null)
                return result.BuildError("Thông tin lịch hẹn không tồn tại hoặc đã bị xóa.");

            return result.BuildResult(AppointmentMapper.ToResponse(lichHen));
        }
    }
}
