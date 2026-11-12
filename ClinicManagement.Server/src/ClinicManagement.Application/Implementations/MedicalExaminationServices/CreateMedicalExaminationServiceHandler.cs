using MayNghien.Infrastructures.Models.Responses;
using Microsoft.EntityFrameworkCore;
using ClinicManagement.Application.Interfaces.Identity;
using ClinicManagement.Application.Interfaces.MedicalExaminationServices;
using ClinicManagement.Application.Interfaces.Repositories;
using ClinicManagement.Application.Mapping;
using ClinicManagement.Domain.Entities;
using ClinicManagement.DTOs.Requests;
using ClinicManagement.DTOs.Responses;

namespace ClinicManagement.Application.Implementations.MedicalExaminationServices
{
    public class CreateMedicalExaminationServiceHandler : ICreateMedicalExaminationServiceHandler
    {
        private readonly IMedicalExaminationServiceRepository _repo;
        private readonly IMedicalServiceRepository _medicalServiceRepo;
        private readonly ICurrentUserService _currentUser;

        public CreateMedicalExaminationServiceHandler(
            IMedicalExaminationServiceRepository repo,
            IMedicalServiceRepository medicalServiceRepo,
            ICurrentUserService currentUser)
        {
            _repo = repo;
            _medicalServiceRepo = medicalServiceRepo;
            _currentUser = currentUser;
        }

        public async Task<AppResponse<List<PhieuKhamDichVuResponse>>> HandleAsync(PhieuKhamDichVuRequest request)
        {
            var result = new AppResponse<List<PhieuKhamDichVuResponse>>();

            var callerEmail = _currentUser.GetEmail();
            if (callerEmail == null)
                return result.BuildError("Unauthorized");

            var services = await _medicalServiceRepo
                .FindBy(x => request.MaDichVus.Contains(x.MaDV) && x.IsDeleted == false)
                .ToListAsync();

            if (services.Count != request.MaDichVus.Distinct().Count())
                return result.BuildError("Một hoặc nhiều dịch vụ không tồn tại.");

            var entities = services.Select(service => new MedicalExaminationService
            {
                Id = Guid.NewGuid(),
                MaPK = request.MaPK,
                MaDV = service.MaDV,
                DonGia = service.DonGia,
                CreatedBy = callerEmail,
                CreatedOn = DateTime.UtcNow,
                IsDeleted = false,
            }).ToList();

            await _repo.AddRangeAsync(entities);

            var response = entities.Select(entity =>
            {
                var dto = MedicalExaminationServiceMapper.ToResponse(entity);
                dto.TenDV = services.First(s => s.MaDV == entity.MaDV).TenDV;
                return dto;
            }).ToList();

            return result.BuildResult(response, "Đã thêm dịch vụ cho phiếu khám.");
        }
    }
}
