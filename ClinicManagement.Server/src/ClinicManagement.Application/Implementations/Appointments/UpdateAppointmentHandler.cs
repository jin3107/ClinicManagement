using MayNghien.Infrastructures.Models.Responses;
using Microsoft.EntityFrameworkCore;
using ClinicManagement.Application.Interfaces.Identity;
using ClinicManagement.Application.Interfaces.Appointments;
using ClinicManagement.Application.Interfaces.Repositories;
using ClinicManagement.Application.Mapping;
using ClinicManagement.DTOs.Requests;
using ClinicManagement.DTOs.Responses;

namespace ClinicManagement.Application.Implementations.Appointments
{
    public class UpdateAppointmentHandler : IUpdateAppointmentHandler
    {
        private static readonly TimeSpan MinGapBetweenAppointments = TimeSpan.FromMinutes(30);

        private readonly IAppointmentRepository _lichHenRepo;
        private readonly ICurrentUserService _currentUser;
        private readonly IDoctorRepository _doctorRepo;
        private readonly IPatientRepository _patientRepo;
        private readonly IPatientScopeService _patientScope;

        public UpdateAppointmentHandler(IAppointmentRepository lichHenRepo, ICurrentUserService currentUser,
            IDoctorRepository doctorRepo, IPatientRepository patientRepo, IPatientScopeService patientScope)
        {
            _doctorRepo = doctorRepo;
            _patientRepo = patientRepo;
            _patientScope = patientScope;
            _lichHenRepo = lichHenRepo;
            _currentUser = currentUser;
        }

        public async Task<AppResponse<LichHenResponse>> HandleAsync(LichHenRequest request)
        {
            var result = new AppResponse<LichHenResponse>();

            var callerEmail = _currentUser.GetEmail();
            if (callerEmail == null)
                return result.BuildError("Unauthorized");

            var lichHen = await _lichHenRepo.GetAsync(request.MaLH);
            if (lichHen == null || lichHen.IsDeleted)
                return result.BuildError("Không tìm thấy lịch hẹn.");

            var pid = await _patientScope.GetRestrictedPatientIdAsync();
            if (pid != null && lichHen.MaBN != pid)
                return result.BuildError("Bạn không có quyền chỉnh sửa lịch hẹn này.");

            var callerRole = _currentUser.GetRole();
            if (callerRole == "BenhNhan")
            {
                if (request.MaBN != lichHen.MaBN || request.MaBS != lichHen.MaBS)
                    return result.BuildError("Bệnh nhân không được thay đổi bác sĩ hoặc bệnh nhân trong lịch hẹn.");
            }

            var validationError = await ValidateNoOverlapAsync(request, lichHen.MaLH);
            if (validationError != null)
                return result.BuildError(validationError);

            lichHen.ThoiGianKham = request.ThoiGianKham;
            lichHen.TrangThai = request.TrangThai;
            lichHen.MaBN = request.MaBN;
            lichHen.MaBS = request.MaBS;
            lichHen.ModifiedBy = callerEmail;
            lichHen.ModifiedOn = DateTime.UtcNow;
            await _lichHenRepo.EditAsync(lichHen);

            return result.BuildResult(AppointmentMapper.ToResponse(lichHen), "Đã cập nhật thông tin lịch hẹn thành công.");
        }

        private async Task<string?> ValidateNoOverlapAsync(LichHenRequest request, Guid? excludedId = null)
        {
            if (request.MaBS != null
                && !await _doctorRepo.FindBy(d => d.MaBS == request.MaBS && d.IsDeleted == false).AnyAsync())
                return "Bác sĩ không tồn tại.";

            if (request.MaBN != null
                && !await _patientRepo.FindBy(p => p.MaBN == request.MaBN && p.IsDeleted == false).AnyAsync())
                return "Bệnh nhân không tồn tại.";

            var rangeStart = request.ThoiGianKham - MinGapBetweenAppointments;
            var rangeEnd = request.ThoiGianKham + MinGapBetweenAppointments;

            if (request.MaBS != null)
            {
                var doctorConflict = _lichHenRepo.FindBy(x =>
                    x.IsDeleted == false
                    && x.MaBS == request.MaBS
                    && x.ThoiGianKham > rangeStart
                    && x.ThoiGianKham < rangeEnd);
                if (excludedId.HasValue)
                    doctorConflict = doctorConflict.Where(x => x.MaLH != excludedId.Value);
                if (await doctorConflict.AnyAsync())
                    return "Bác sĩ đã có lịch hẹn khác gần thời điểm này.";
            }

            if (request.MaBN != null)
            {
                var patientConflict = _lichHenRepo.FindBy(x =>
                    x.IsDeleted == false
                    && x.MaBN == request.MaBN
                    && x.ThoiGianKham > rangeStart
                    && x.ThoiGianKham < rangeEnd);
                if (excludedId.HasValue)
                    patientConflict = patientConflict.Where(x => x.MaLH != excludedId.Value);
                if (await patientConflict.AnyAsync())
                    return "Bệnh nhân đã có lịch hẹn khác gần thời điểm này.";
            }

            return null;
        }
    }
}
