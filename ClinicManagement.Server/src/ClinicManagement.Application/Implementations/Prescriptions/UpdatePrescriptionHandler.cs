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
    public class UpdatePrescriptionHandler : IUpdatePrescriptionHandler
    {
        private readonly IPrescriptionRepository _donThuocRepo;
        private readonly IPrescriptionDetailRepository _chiTietRepo;
        private readonly ICurrentUserService _currentUser;

        public UpdatePrescriptionHandler(IPrescriptionRepository donThuocRepo,
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

            var donThuoc = await _donThuocRepo
                .FindBy(x => x.MaDT == request.MaDT && x.IsDeleted == false)
                .Include(x => x.PrescriptionDetails)
                .FirstOrDefaultAsync();
            if (donThuoc == null)
                return result.BuildError("Thông tin đơn thuốc không tồn tại.");

            var oldChiTietList = donThuoc.PrescriptionDetails?.ToList() ?? [];
            if (oldChiTietList.Count > 0)
            {
                foreach (var ct in oldChiTietList)
                {
                    ct.IsDeleted = true;
                    ct.ModifiedBy = callerEmail;
                    ct.ModifiedOn = DateTime.UtcNow;
                }
                await _chiTietRepo.EditRangeAsync(oldChiTietList);
            }

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
            await _chiTietRepo.AddRangeAsync(chiTietList);

            donThuoc.ModifiedBy = callerEmail;
            donThuoc.ModifiedOn = DateTime.UtcNow;
            await _donThuocRepo.EditAsync(donThuoc);

            var updated = await _donThuocRepo
                .FindBy(x => x.MaDT == donThuoc.MaDT)
                .Include(x => x.PrescriptionDetails!)
                    .ThenInclude(ct => ct.Medicine)
                .FirstOrDefaultAsync();

            return result.BuildResult(PrescriptionMapper.ToResponse(updated!), "Cập nhật thông tin đơn thuốc thành công.");
        }
    }
}
