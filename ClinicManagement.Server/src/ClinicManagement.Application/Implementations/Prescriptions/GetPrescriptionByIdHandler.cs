using MayNghien.Infrastructures.Models.Responses;
using Microsoft.EntityFrameworkCore;
using ClinicManagement.Application.Interfaces.Prescriptions;
using ClinicManagement.Application.Interfaces.Repositories;
using ClinicManagement.Application.Mapping;
using ClinicManagement.DTOs.Responses;

namespace ClinicManagement.Application.Implementations.Prescriptions
{
    public class GetPrescriptionByIdHandler : IGetPrescriptionByIdHandler
    {
        private readonly IPrescriptionRepository _donThuocRepo;

        public GetPrescriptionByIdHandler(IPrescriptionRepository donThuocRepo)
        {
            _donThuocRepo = donThuocRepo;
        }

        public async Task<AppResponse<DonThuocResponse>> HandleAsync(Guid id)
        {
            var result = new AppResponse<DonThuocResponse>();

            var donThuoc = await _donThuocRepo
                .FindBy(x => x.MaDT == id && x.IsDeleted == false)
                .Include(x => x.PrescriptionDetails!)
                    .ThenInclude(ct => ct.Medicine)
                .FirstOrDefaultAsync();
            if (donThuoc == null)
                return result.BuildError("Thông tin đơn thuốc không tồn tại.");

            return result.BuildResult(PrescriptionMapper.ToResponse(donThuoc));
        }
    }
}
