using MayNghien.Infrastructures.Models.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ClinicManagement.Application.Interfaces.MedicalExaminations;
using ClinicManagement.DTOs.Requests;

namespace ClinicManagement.API.Controllers
{
    [Route("phieukham")]
    [ApiController]
    public class MedicalExaminationController : ControllerBase
    {
        private readonly ICreateMedicalExaminationHandler _create;
        private readonly IUpdateMedicalExaminationHandler _update;
        private readonly IDeleteMedicalExaminationHandler _delete;
        private readonly IGetMedicalExaminationByIdHandler _getById;
        private readonly ISearchMedicalExaminationHandler _search;

        public MedicalExaminationController(
            ICreateMedicalExaminationHandler create,
            IUpdateMedicalExaminationHandler update,
            IDeleteMedicalExaminationHandler delete,
            IGetMedicalExaminationByIdHandler getById,
            ISearchMedicalExaminationHandler search)
        {
            _create = create;
            _update = update;
            _delete = delete;
            _getById = getById;
            _search = search;
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "SuperAdmin, BacSi, LeTan, BenhNhan")]
        public async Task<IActionResult> GetById([FromRoute] Guid id)
            => Ok(await _getById.HandleAsync(id));

        [HttpPost]
        [Authorize(Roles = "LeTan, BacSi")]
        public async Task<IActionResult> Create([FromBody] PhieuKhamRequest request)
            => Ok(await _create.HandleAsync(request));

        [HttpPut]
        [Authorize(Roles = "LeTan, BacSi")]
        public async Task<IActionResult> Update([FromBody] PhieuKhamRequest request)
            => Ok(await _update.HandleAsync(request));

        [HttpDelete("{id}")]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> Delete([FromRoute] Guid id)
            => Ok(await _delete.HandleAsync(id));

        [HttpPost("search")]
        [Authorize(Roles = "SuperAdmin, BacSi, LeTan")]
        public async Task<IActionResult> Search([FromBody] SearchRequest request)
            => Ok(await _search.HandleAsync(request));
    }
}
