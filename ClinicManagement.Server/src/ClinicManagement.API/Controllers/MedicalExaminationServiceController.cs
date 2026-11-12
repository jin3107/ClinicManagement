using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ClinicManagement.Application.Interfaces.MedicalExaminationServices;
using ClinicManagement.DTOs.Requests;

namespace ClinicManagement.API.Controllers
{
    [Route("phieukhamdichvu")]
    [ApiController]
    public class MedicalExaminationServiceController : ControllerBase
    {
        private readonly ICreateMedicalExaminationServiceHandler _create;
        private readonly IGetMedicalExaminationServicesByExamHandler _getByExam;
        private readonly IDeleteMedicalExaminationServiceHandler _delete;

        public MedicalExaminationServiceController(
            ICreateMedicalExaminationServiceHandler create,
            IGetMedicalExaminationServicesByExamHandler getByExam,
            IDeleteMedicalExaminationServiceHandler delete)
        {
            _create = create;
            _getByExam = getByExam;
            _delete = delete;
        }

        [HttpPost]
        [Authorize(Roles = "SuperAdmin, BacSi")]
        public async Task<IActionResult> Create([FromBody] PhieuKhamDichVuRequest request)
            => Ok(await _create.HandleAsync(request));

        [HttpGet("by-exam/{maPK}")]
        [Authorize(Roles = "SuperAdmin, BacSi, LeTan, BenhNhan")]
        public async Task<IActionResult> GetByExam([FromRoute] Guid maPK)
            => Ok(await _getByExam.HandleAsync(maPK));

        [HttpDelete("{id}")]
        [Authorize(Roles = "SuperAdmin, BacSi")]
        public async Task<IActionResult> Delete([FromRoute] Guid id)
            => Ok(await _delete.HandleAsync(id));
    }
}
