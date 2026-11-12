using MayNghien.Infrastructures.Models.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ClinicManagement.Application.Interfaces.Staffs;
using ClinicManagement.DTOs.Requests;

namespace ClinicManagement.API.Controllers
{
    [Route("nhanvien")]
    [Authorize(Roles = "SuperAdmin")]
    [ApiController]
    public class StaffController : ControllerBase
    {
        private readonly ICreateStaffHandler _create;
        private readonly IUpdateStaffHandler _update;
        private readonly IDeleteStaffHandler _delete;
        private readonly IGetStaffByIdHandler _getById;
        private readonly ISearchStaffHandler _search;

        public StaffController(
            ICreateStaffHandler create,
            IUpdateStaffHandler update,
            IDeleteStaffHandler delete,
            IGetStaffByIdHandler getById,
            ISearchStaffHandler search)
        {
            _create = create;
            _update = update;
            _delete = delete;
            _getById = getById;
            _search = search;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById([FromRoute] Guid id)
            => Ok(await _getById.HandleAsync(id));

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] NhanVienRequest request)
            => Ok(await _create.HandleAsync(request));

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] NhanVienRequest request)
            => Ok(await _update.HandleAsync(request));

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete([FromRoute] Guid id)
            => Ok(await _delete.HandleAsync(id));

        [HttpPost("search")]
        public async Task<IActionResult> Search([FromBody] SearchRequest request)
            => Ok(await _search.HandleAsync(request));
    }
}
