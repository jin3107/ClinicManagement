using MayNghien.Infrastructures.Models.Responses;
using Microsoft.EntityFrameworkCore;
using ClinicManagement.Application.Interfaces.Identity;
using ClinicManagement.Application.Interfaces.WorkSchedules;
using ClinicManagement.Application.Interfaces.Repositories;
using ClinicManagement.Application.Mapping;
using ClinicManagement.DTOs.Requests;
using ClinicManagement.DTOs.Responses;

namespace ClinicManagement.Application.Implementations.WorkSchedules
{
    public class UpdateWorkScheduleHandler : IUpdateWorkScheduleHandler
    {
        private readonly IWorkScheduleRepository _repo;
        private readonly ICurrentUserService _currentUser;

        public UpdateWorkScheduleHandler(IWorkScheduleRepository repo, ICurrentUserService currentUser)
        {
            _repo = repo;
            _currentUser = currentUser;
        }

        public async Task<AppResponse<LichLamViecResponse>> HandleAsync(LichLamViecRequest request)
        {
            var result = new AppResponse<LichLamViecResponse>();

            var callerEmail = _currentUser.GetEmail();
            if (callerEmail == null)
                return result.BuildError("Unauthorized");

            var entity = await _repo.FindBy(x => x.MaLLV == request.MaLLV && x.IsDeleted == false)
                .Include(x => x.Doctor)
                .FirstOrDefaultAsync();
            if (entity == null)
                return result.BuildError("Thông tin lịch làm việc không tồn tại.");

            var validationError = await ValidateScheduleAsync(request, entity.MaLLV);
            if (validationError != null)
                return result.BuildError(validationError);

            entity.NgayLamViec = request.NgayLamViec;
            entity.GioBatDau = request.GioBatDau;
            entity.GioKetThuc = request.GioKetThuc;
            entity.MaBS = request.MaBS;
            entity.ModifiedBy = callerEmail;
            entity.ModifiedOn = DateTime.UtcNow;
            await _repo.EditAsync(entity);

            return result.BuildResult(WorkScheduleMapper.ToResponse(entity), "Cập nhật thông tin lịch làm việc thành công.");
        }

        private async Task<string?> ValidateScheduleAsync(LichLamViecRequest request, Guid? excludedId = null)
        {
            if (request.MaBS == null)
                return "Vui lòng chọn bác sĩ.";

            if (request.GioBatDau >= request.GioKetThuc)
                return "Giờ kết thúc phải sau giờ bắt đầu.";

            var workDate = request.NgayLamViec.Date;
            var nextDate = workDate.AddDays(1);

            var schedules = _repo.FindBy(x =>
                x.IsDeleted == false
                && x.MaBS == request.MaBS
                && x.NgayLamViec >= workDate
                && x.NgayLamViec < nextDate
                && x.GioBatDau < request.GioKetThuc
                && request.GioBatDau < x.GioKetThuc);

            if (excludedId.HasValue)
                schedules = schedules.Where(x => x.MaLLV != excludedId.Value);

            return await schedules.AnyAsync() ? "Lịch bị trùng." : null;
        }
    }
}
