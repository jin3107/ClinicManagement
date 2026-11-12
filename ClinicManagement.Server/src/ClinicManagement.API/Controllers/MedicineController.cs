using MayNghien.Infrastructures.Models.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ClinicManagement.Application.Interfaces.Medicines;
using ClinicManagement.DTOs.Requests;

namespace ClinicManagement.API.Controllers
{
    [Route("danhmucthuoc")]
    [ApiController]
    public class MedicineController : ControllerBase
    {
        private readonly ICreateMedicineHandler _create;
        private readonly IUpdateMedicineHandler _update;
        private readonly IDeleteMedicineHandler _delete;
        private readonly IGetMedicineByIdHandler _getById;
        private readonly ISearchMedicineHandler _search;

        public MedicineController(
            ICreateMedicineHandler create,
            IUpdateMedicineHandler update,
            IDeleteMedicineHandler delete,
            IGetMedicineByIdHandler getById,
            ISearchMedicineHandler search)
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
        public async Task<IActionResult> Create([FromBody] DanhMucThuocRequest request)
            => Ok(await _create.HandleAsync(request));

        [HttpPut]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> Update([FromBody] DanhMucThuocRequest request)
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
