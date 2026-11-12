using MayNghien.Infrastructures.Models.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ClinicManagement.Application.Interfaces.Appointments;
using ClinicManagement.DTOs.Requests;

namespace ClinicManagement.API.Controllers
{
    [Route("lichhen")]
    [ApiController]
    public class AppointmentController : ControllerBase
    {
        private readonly ICreateAppointmentHandler _create;
        private readonly IUpdateAppointmentHandler _update;
        private readonly IDeleteAppointmentHandler _delete;
        private readonly IGetAppointmentByIdHandler _getById;
        private readonly ISearchAppointmentHandler _search;

        public AppointmentController(
            ICreateAppointmentHandler create,
            IUpdateAppointmentHandler update,
            IDeleteAppointmentHandler delete,
            IGetAppointmentByIdHandler getById,
            ISearchAppointmentHandler search)
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
        public async Task<IActionResult> Create([FromBody] LichHenRequest request)
            => Ok(await _create.HandleAsync(request));

        [HttpPut]
        [Authorize(Roles = "SuperAdmin, LeTan, BenhNhan")]
        public async Task<IActionResult> Update([FromBody] LichHenRequest request)
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
