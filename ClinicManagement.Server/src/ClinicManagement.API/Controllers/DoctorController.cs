using MayNghien.Infrastructures.Models.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ClinicManagement.Application.Interfaces.Doctors;
using ClinicManagement.DTOs.Requests;

namespace ClinicManagement.API.Controllers
{
    [Route("bacsi")]
    [ApiController]
    public class DoctorController : ControllerBase
    {
        private readonly ICreateDoctorHandler _create;
        private readonly IUpdateDoctorHandler _update;
        private readonly IDeleteDoctorHandler _delete;
        private readonly IGetDoctorByIdHandler _getById;
        private readonly ISearchDoctorHandler _search;

        public DoctorController(
            ICreateDoctorHandler create,
            IUpdateDoctorHandler update,
            IDeleteDoctorHandler delete,
            IGetDoctorByIdHandler getById,
            ISearchDoctorHandler search)
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
        [Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> Create([FromBody] BacSiRequest request)
            => Ok(await _create.HandleAsync(request));

        [HttpPut]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> Update([FromBody] BacSiRequest request)
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
