using MayNghien.Infrastructures.Models.Responses;
using Microsoft.EntityFrameworkCore;
using ClinicManagement.Application.Interfaces.WorkSchedules;
using ClinicManagement.Application.Interfaces.Repositories;
using ClinicManagement.Application.Mapping;
using ClinicManagement.DTOs.Responses;

namespace ClinicManagement.Application.Implementations.WorkSchedules
{
    public class GetWorkScheduleByIdHandler : IGetWorkScheduleByIdHandler
    {
        private readonly IWorkScheduleRepository _repo;

        public GetWorkScheduleByIdHandler(IWorkScheduleRepository repo)
        {
            _repo = repo;
        }

        public async Task<AppResponse<LichLamViecResponse>> HandleAsync(Guid id)
        {
            var result = new AppResponse<LichLamViecResponse>();

            var entity = await _repo.FindBy(x => x.MaLLV == id && x.IsDeleted == false)
                .Include(x => x.Doctor)
                .FirstOrDefaultAsync();
            if (entity == null)
                return result.BuildError("Thông tin lịch làm việc không tồn tại.");

            return result.BuildResult(WorkScheduleMapper.ToResponse(entity));
        }
    }
}
