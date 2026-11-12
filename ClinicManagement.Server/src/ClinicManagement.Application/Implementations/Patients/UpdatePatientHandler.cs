using MayNghien.Infrastructures.Models.Responses;
using ClinicManagement.Application.Interfaces.Patients;
using ClinicManagement.Application.Interfaces.Identity;
using ClinicManagement.Application.Interfaces.Repositories;
using ClinicManagement.Application.Mapping;
using ClinicManagement.DTOs.Requests;
using ClinicManagement.DTOs.Responses;

namespace ClinicManagement.Application.Implementations.Patients
{
    public class UpdatePatientHandler : IUpdatePatientHandler
    {
        private readonly IPatientRepository _benhNhanRepository;
        private readonly ICurrentUserService _currentUser;

        public UpdatePatientHandler(IPatientRepository benhNhanRepository,
            ICurrentUserService currentUser)
        {
            _benhNhanRepository = benhNhanRepository;
            _currentUser = currentUser;
        }

        public async Task<AppResponse<BenhNhanResponse>> HandleAsync(BenhNhanRequest request)
        {
            var result = new AppResponse<BenhNhanResponse>();

            var callerEmail = _currentUser.GetEmail();
            if (callerEmail == null)
                return result.BuildError("Unauthorized");

            var entity = await _benhNhanRepository.GetAsync(request.MaBN!.Value);
            if (entity == null || entity.IsDeleted)
                return result.BuildError("Thông tin bệnh nhân không tồn tại.");

            entity.HoTen = request.HoTen;
            entity.NgaySinh = request.NgaySinh;
            entity.GioiTinh = request.GioiTinh;
            entity.SoDienThoai = request.SoDienThoai;
            entity.DiaChi = request.DiaChi;
            entity.SoBHYT = request.SoBHYT;
            entity.TienSuDiUng = request.TienSuDiUng;
            entity.ModifiedBy = callerEmail;
            entity.ModifiedOn = DateTime.UtcNow;
            await _benhNhanRepository.EditAsync(entity);

            return result.BuildResult(PatientMapper.ToResponse(entity), "Cập nhật thông tin bệnh nhân thành công.");
        }
    }
}
