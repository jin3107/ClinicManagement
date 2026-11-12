using MayNghien.Infrastructures.Models.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ClinicManagement.Application.Interfaces.Patients;
using ClinicManagement.DTOs.Requests;

namespace ClinicManagement.API.Controllers
{
    [Route("benhnhan")]
    [ApiController]
    public class PatientController : ControllerBase
    {
        private readonly ICreatePatientHandler _create;
        private readonly IUpdatePatientHandler _update;
        private readonly IDeletePatientHandler _delete;
        private readonly IGetPatientByIdHandler _getById;
        private readonly ISearchPatientHandler _search;

        public PatientController(
            ICreatePatientHandler create,
            IUpdatePatientHandler update,
            IDeletePatientHandler delete,
            IGetPatientByIdHandler getById,
            ISearchPatientHandler search)
        {
            _create = create;
            _update = update;
            _delete = delete;
            _getById = getById;
            _search = search;
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "SuperAdmin, LeTan, BacSi, BenhNhan")]
        public async Task<IActionResult> GetById([FromRoute] Guid id)
            => Ok(await _getById.HandleAsync(id));

        [HttpPost]
        [Authorize(Roles = "LeTan, BenhNhan")]
        public async Task<IActionResult> Create([FromBody] BenhNhanRequest request)
            => Ok(await _create.HandleAsync(request));

        [HttpPut]
        [Authorize(Roles = "SuperAdmin, LeTan, BenhNhan")]
        public async Task<IActionResult> Update([FromBody] BenhNhanRequest request)
            => Ok(await _update.HandleAsync(request));

        [HttpDelete("{id}")]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> Delete([FromRoute] Guid id)
            => Ok(await _delete.HandleAsync(id));

        [HttpPost("search")]
        [Authorize(Roles = "SuperAdmin, LeTan, BacSi, BenhNhan")]
        public async Task<IActionResult> Search([FromBody] SearchRequest request)
            => Ok(await _search.HandleAsync(request));
    }
}
