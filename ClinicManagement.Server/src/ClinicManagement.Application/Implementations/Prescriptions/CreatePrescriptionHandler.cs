using MayNghien.Infrastructures.Models.Responses;
using Microsoft.EntityFrameworkCore;
using ClinicManagement.Application.Interfaces.Prescriptions;
using ClinicManagement.Application.Interfaces.Identity;
using ClinicManagement.Application.Interfaces.Repositories;
using ClinicManagement.Application.Mapping;
using ClinicManagement.Domain.Entities;
using ClinicManagement.DTOs.Requests;
using ClinicManagement.DTOs.Responses;

namespace ClinicManagement.Application.Implementations.Prescriptions
{
    public class CreatePrescriptionHandler : ICreatePrescriptionHandler
    {
        private readonly IPrescriptionRepository _donThuocRepo;
        private readonly IPrescriptionDetailRepository _chiTietRepo;
        private readonly ICurrentUserService _currentUser;

        public CreatePrescriptionHandler(IPrescriptionRepository donThuocRepo,
            IPrescriptionDetailRepository chiTietRepo, ICurrentUserService currentUser)
        {
            _donThuocRepo = donThuocRepo;
            _chiTietRepo = chiTietRepo;
            _currentUser = currentUser;
        }

        public async Task<AppResponse<DonThuocResponse>> HandleAsync(DonThuocRequest request)
        {
            var result = new AppResponse<DonThuocResponse>();

            var callerEmail = _currentUser.GetEmail();
            if (callerEmail == null)
                return result.BuildError("Unauthorized");

            var donThuoc = PrescriptionMapper.ToEntity(request);
            donThuoc.MaDT = Guid.NewGuid();
            donThuoc.CreatedBy = callerEmail;
            donThuoc.CreatedOn = DateTime.UtcNow;
            donThuoc.IsDeleted = false;

            var chiTietList = request.ChiTietDonThuocs.Select(ct => new PrescriptionDetail
            {
                MaCTDT = Guid.NewGuid(),
                MaDT = donThuoc.MaDT,
                MaThuoc = ct.MaThuoc,
                SoLuong = ct.SoLuong,
                LieuDung = ct.LieuDung,
                CreatedBy = callerEmail,
                CreatedOn = DateTime.UtcNow,
                IsDeleted = false,
            }).ToList();

            // Attach details to the header so EF inserts the whole graph in one SaveChanges (one transaction).
            donThuoc.PrescriptionDetails = chiTietList;
            await _donThuocRepo.AddAsync(donThuoc);

            var created = await _donThuocRepo
                .FindBy(x => x.MaDT == donThuoc.MaDT)
                .Include(x => x.PrescriptionDetails!)
                    .ThenInclude(ct => ct.Medicine)
                .FirstOrDefaultAsync();

            return result.BuildResult(PrescriptionMapper.ToResponse(created!), "Thêm thông tin đơn thuốc thành công.");
        }
    }
}
