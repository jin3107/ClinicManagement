using MayNghien.Infrastructures.Models.Responses;
using Microsoft.EntityFrameworkCore;
using ClinicManagement.Application.Interfaces.Identity;
using ClinicManagement.Application.Interfaces.MedicalExaminations;
using ClinicManagement.Application.Interfaces.Repositories;
using ClinicManagement.Application.Mapping;
using ClinicManagement.DTOs.Requests;
using ClinicManagement.DTOs.Responses;

namespace ClinicManagement.Application.Implementations.MedicalExaminations
{
    public class UpdateMedicalExaminationHandler : IUpdateMedicalExaminationHandler
    {
        private readonly IMedicalExaminationRepository _repo;
        private readonly ICurrentUserService _currentUser;

        public UpdateMedicalExaminationHandler(IMedicalExaminationRepository repo, ICurrentUserService currentUser)
        {
            _repo = repo;
            _currentUser = currentUser;
        }

        public async Task<AppResponse<PhieuKhamResponse>> HandleAsync(PhieuKhamRequest request)
        {
            var result = new AppResponse<PhieuKhamResponse>();

            var callerEmail = _currentUser.GetEmail();
            if (callerEmail == null)
                return result.BuildError("Unauthorized");

            var entity = await _repo.FindBy(x => x.MaPK == request.MaPK && x.IsDeleted == false)
                .Include(x => x.Doctor)
                .Include(x => x.Appointment!).ThenInclude(l => l.Patient)
                .FirstOrDefaultAsync();
            if (entity == null)
                return result.BuildError("Thông tin phiếu khám không tồn tại.");

            entity.NgayKham = request.NgayKham;
            entity.TrieuChung = request.TrieuChung;
            entity.ChuanDoan = request.ChuanDoan;
            entity.HuongDieuTri = request.HuongDieuTri;
            entity.TrangThaiTiepNhan = request.TrangThaiTiepNhan;
            entity.MaLH = request.MaLH;
            entity.MaBS = request.MaBS;
            entity.ModifiedBy = callerEmail;
            entity.ModifiedOn = DateTime.UtcNow;
            await _repo.EditAsync(entity);

            return result.BuildResult(MedicalExaminationMapper.ToResponse(entity), "Cập nhật thông tin phiếu khám thành công.");
        }
    }
}
