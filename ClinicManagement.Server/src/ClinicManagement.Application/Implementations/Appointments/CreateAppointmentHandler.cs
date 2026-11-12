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
    public class CreateAppointmentHandler : ICreateAppointmentHandler
    {
        private static readonly TimeSpan MinGapBetweenAppointments = TimeSpan.FromMinutes(30);

        private readonly IAppointmentRepository _lichHenRepo;
        private readonly ICurrentUserService _currentUser;

        public CreateAppointmentHandler(IAppointmentRepository lichHenRepo, ICurrentUserService currentUser)
        {
            _lichHenRepo = lichHenRepo;
            _currentUser = currentUser;
        }

        public async Task<AppResponse<LichHenResponse>> HandleAsync(LichHenRequest request)
        {
            var result = new AppResponse<LichHenResponse>();

            var callerEmail = _currentUser.GetEmail();
            if (callerEmail == null)
                return result.BuildError("Unauthorized");

            var validationError = await ValidateNoOverlapAsync(request);
            if (validationError != null)
                return result.BuildError(validationError);

            var entity = AppointmentMapper.ToEntity(request);
            entity.MaLH = Guid.NewGuid();
            entity.ThoiGianKham = request.ThoiGianKham;
            entity.TrangThai = request.TrangThai;
            entity.MaBN = request.MaBN;
            entity.MaBS = request.MaBS;
            entity.CreatedBy = callerEmail;
            entity.CreatedOn = DateTime.UtcNow;
            entity.IsDeleted = false;
            await _lichHenRepo.AddAsync(entity);

            return result.BuildResult(AppointmentMapper.ToResponse(entity), "Đã tạo thông tin cho lịch hẹn thành công.");
        }

        private async Task<string?> ValidateNoOverlapAsync(LichHenRequest request, Guid? excludedId = null)
        {
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
