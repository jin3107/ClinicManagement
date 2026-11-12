using MayNghien.Infrastructures.Models.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ClinicManagement.Application.Interfaces.Prescriptions;
using ClinicManagement.DTOs.Requests;

namespace ClinicManagement.API.Controllers
{
    [Route("donthuoc")]
    [ApiController]
    public class PrescriptionController : ControllerBase
    {
        private readonly ICreatePrescriptionHandler _create;
        private readonly IUpdatePrescriptionHandler _update;
        private readonly IDeletePrescriptionHandler _delete;
        private readonly IGetPrescriptionByIdHandler _getById;
        private readonly ISearchPrescriptionHandler _search;

        public PrescriptionController(
            ICreatePrescriptionHandler create,
            IUpdatePrescriptionHandler update,
            IDeletePrescriptionHandler delete,
            IGetPrescriptionByIdHandler getById,
            ISearchPrescriptionHandler search)
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
        [Authorize(Roles = "BacSi")]
        public async Task<IActionResult> Create([FromBody] DonThuocRequest request)
            => Ok(await _create.HandleAsync(request));

        [HttpPut]
        [Authorize(Roles = "SuperAdmin, BacSi")]
        public async Task<IActionResult> Update([FromBody] DonThuocRequest request)
            => Ok(await _update.HandleAsync(request));

        [HttpDelete("{id}")]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> Delete([FromRoute] Guid id)
            => Ok(await _delete.HandleAsync(id));

        [HttpPost("search")]
        [Authorize(Roles = "SuperAdmin, BacSi, LeTan, BenhNhan")]
        public async Task<IActionResult> Search([FromBody] SearchRequest request)
            => Ok(await _search.HandleAsync(request));
    }
}
