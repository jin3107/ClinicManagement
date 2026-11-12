using MayNghien.Infrastructures.Models.Responses;
using Microsoft.EntityFrameworkCore;
using ClinicManagement.Application.Interfaces.Medicines;
using ClinicManagement.Application.Interfaces.Repositories;
using ClinicManagement.Application.Mapping;
using ClinicManagement.DTOs.Responses;

namespace ClinicManagement.Application.Implementations.Medicines
{
    public class GetMedicineByIdHandler : IGetMedicineByIdHandler
    {
        private readonly IMedicineRepository _repo;

        public GetMedicineByIdHandler(IMedicineRepository repo)
        {
            _repo = repo;
        }

        public async Task<AppResponse<DanhMucThuocResponse>> HandleAsync(Guid id)
        {
            var result = new AppResponse<DanhMucThuocResponse>();

            var entity = await _repo.FindBy(b => b.MaThuoc == id && b.IsDeleted == false)
                .FirstOrDefaultAsync();
            if (entity == null)
                return result.BuildError("Thông tin danh mục thuốc không tồn tại hoặc đã bị xóa.");

            return result.BuildResult(MedicineMapper.ToResponse(entity));
        }
    }
}
