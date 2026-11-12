using ClinicManagement.Application.Interfaces.Identity;
using MayNghien.Infrastructures.Models.Responses;
using Microsoft.EntityFrameworkCore;
using ClinicManagement.Application.Interfaces.Invoices;
using ClinicManagement.Application.Interfaces.Repositories;
using ClinicManagement.Application.Mapping;
using ClinicManagement.DTOs.Responses;

namespace ClinicManagement.Application.Implementations.Invoices
{
    public class GetInvoiceByIdHandler : IGetInvoiceByIdHandler
    {
        private readonly IInvoiceRepository _hoaDonRepo;

        private readonly IPatientScopeService _patientScope;

        public GetInvoiceByIdHandler(IInvoiceRepository hoaDonRepo, IPatientScopeService patientScope)
        {
            _patientScope = patientScope;
            _hoaDonRepo = hoaDonRepo;
        }

        public async Task<AppResponse<HoaDonResponse>> HandleAsync(Guid id)
        {
            var result = new AppResponse<HoaDonResponse>();

            var pid = await _patientScope.GetRestrictedPatientIdAsync();
            var entity = await _hoaDonRepo.FindBy(x => x.MaHD == id && x.IsDeleted == false)
                .Where(x => pid == null || x.MedicalExamination!.Appointment!.MaBN == pid)
                .Include(x => x.MedicalExamination!).ThenInclude(p => p.Appointment!).ThenInclude(l => l.Patient)
                .FirstOrDefaultAsync();
            if (entity == null)
                return result.BuildError("Thông tin hóa đơn không tồn tại.");

            return result.BuildResult(InvoiceMapper.ToResponse(entity));
        }
    }
}
