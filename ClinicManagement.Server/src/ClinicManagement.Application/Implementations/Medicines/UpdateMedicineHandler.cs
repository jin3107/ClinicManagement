using MayNghien.Infrastructures.Models.Responses;
using ClinicManagement.Application.Interfaces.Medicines;
using ClinicManagement.Application.Interfaces.Identity;
using ClinicManagement.Application.Interfaces.Repositories;
using ClinicManagement.Application.Mapping;
using ClinicManagement.DTOs.Requests;
using ClinicManagement.DTOs.Responses;

namespace ClinicManagement.Application.Implementations.Medicines
{
    public class UpdateMedicineHandler : IUpdateMedicineHandler
    {
        private readonly IMedicineRepository _repo;
        private readonly ICurrentUserService _currentUser;

        public UpdateMedicineHandler(IMedicineRepository repo, ICurrentUserService currentUser)
        {
            _repo = repo;
            _currentUser = currentUser;
        }

        public async Task<AppResponse<DanhMucThuocResponse>> HandleAsync(DanhMucThuocRequest request)
        {
            var result = new AppResponse<DanhMucThuocResponse>();

            var callerEmail = _currentUser.GetEmail();
            if (callerEmail == null)
                return result.BuildError("Unauthorized");

            var entity = await _repo.GetAsync(request.MaThuoc);
            if (entity == null || entity.IsDeleted)
                return result.BuildError("Không tìm thấy danh mục thuốc.");

            entity.TenThuoc = request.TenThuoc;
            entity.DonGia = request.DonGia;
            entity.ChongChiDinh = request.ChongChiDinh;
            entity.ModifiedBy = callerEmail;
            entity.ModifiedOn = DateTime.UtcNow;
            await _repo.EditAsync(entity);

            return result.BuildResult(MedicineMapper.ToResponse(entity), "Đã cập nhật thông tin danh mục thuốc thành công.");
        }
    }
}
