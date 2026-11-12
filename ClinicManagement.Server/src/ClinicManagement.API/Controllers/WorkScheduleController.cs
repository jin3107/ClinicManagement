using MayNghien.Infrastructures.Models.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ClinicManagement.Application.Interfaces.WorkSchedules;
using ClinicManagement.DTOs.Requests;

namespace ClinicManagement.API.Controllers
{
    [Route("lichlamviec")]
    [ApiController]
    public class WorkScheduleController : ControllerBase
    {
        private readonly ICreateWorkScheduleHandler _create;
        private readonly IUpdateWorkScheduleHandler _update;
        private readonly IDeleteWorkScheduleHandler _delete;
        private readonly IGetWorkScheduleByIdHandler _getById;
        private readonly ISearchWorkScheduleHandler _search;

        public WorkScheduleController(
            ICreateWorkScheduleHandler create,
            IUpdateWorkScheduleHandler update,
            IDeleteWorkScheduleHandler delete,
            IGetWorkScheduleByIdHandler getById,
            ISearchWorkScheduleHandler search)
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
        [Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> Create([FromBody] LichLamViecRequest request)
            => Ok(await _create.HandleAsync(request));

        [HttpPut]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> Update([FromBody] LichLamViecRequest request)
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
