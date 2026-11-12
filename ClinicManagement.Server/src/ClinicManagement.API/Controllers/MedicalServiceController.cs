using MayNghien.Infrastructures.Models.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ClinicManagement.Application.Interfaces.MedicalServices;
using ClinicManagement.DTOs.Requests;

namespace ClinicManagement.API.Controllers
{
    [Route("danhmucdichvu")]
    [ApiController]
    public class MedicalServiceController : ControllerBase
    {
        private readonly ICreateMedicalServiceHandler _create;
        private readonly IUpdateMedicalServiceHandler _update;
        private readonly IDeleteMedicalServiceHandler _delete;
        private readonly IGetMedicalServiceByIdHandler _getById;
        private readonly ISearchMedicalServiceHandler _search;

        public MedicalServiceController(
            ICreateMedicalServiceHandler create,
            IUpdateMedicalServiceHandler update,
            IDeleteMedicalServiceHandler delete,
            IGetMedicalServiceByIdHandler getById,
            ISearchMedicalServiceHandler search)
        {
            _create = create;
            _update = update;
            _delete = delete;
            _getById = getById;
            _search = search;
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "SuperAdmin, LeTan, BacSi")]
        public async Task<IActionResult> GetById([FromRoute] Guid id)
            => Ok(await _getById.HandleAsync(id));

        [HttpPost]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> Create([FromBody] DanhMucDichVuRequest request)
            => Ok(await _create.HandleAsync(request));

        [HttpPut]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> Update([FromBody] DanhMucDichVuRequest request)
            => Ok(await _update.HandleAsync(request));

        [HttpDelete("{id}")]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> Delete([FromRoute] Guid id)
            => Ok(await _delete.HandleAsync(id));

        [HttpPost("search")]
        [Authorize(Roles = "SuperAdmin, LeTan, BacSi")]
        public async Task<IActionResult> Search([FromBody] SearchRequest request)
            => Ok(await _search.HandleAsync(request));
    }
}
