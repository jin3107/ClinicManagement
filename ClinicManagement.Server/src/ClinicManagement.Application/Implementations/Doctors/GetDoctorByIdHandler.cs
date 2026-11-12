using MayNghien.Infrastructures.Models.Responses;
using Microsoft.EntityFrameworkCore;
using ClinicManagement.Application.Interfaces.Doctors;
using ClinicManagement.Application.Interfaces.Identity;
using ClinicManagement.Application.Interfaces.Repositories;
using ClinicManagement.Application.Mapping;
using ClinicManagement.DTOs.Responses;

namespace ClinicManagement.Application.Implementations.Doctors
{
    public class GetDoctorByIdHandler : IGetDoctorByIdHandler
    {
        private readonly IDoctorRepository _bacSiRepository;
        private readonly IIdentityUserService _identityUserService;

        public GetDoctorByIdHandler(IDoctorRepository bacSiRepository,
            IIdentityUserService identityUserService)
        {
            _bacSiRepository = bacSiRepository;
            _identityUserService = identityUserService;
        }

        public async Task<AppResponse<BacSiResponse>> HandleAsync(Guid id)
        {
            var result = new AppResponse<BacSiResponse>();

            var bacSi = await _bacSiRepository.FindBy(b => b.MaBS == id && b.IsDeleted == false)
                .FirstOrDefaultAsync();

            if (bacSi == null)
                return result.BuildError("Thông tin bác sĩ không tồn tại hoặc đã bị xóa.");

            var email = !string.IsNullOrEmpty(bacSi.MaTK)
                ? await _identityUserService.GetEmailByIdAsync(bacSi.MaTK)
                : null;

            var response = DoctorMapper.ToResponse(bacSi, email);
            return result.BuildResult(response);
        }
    }
}
