using MayNghien.Infrastructures.Models.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ClinicManagement.Application.Interfaces.Invoices;
using ClinicManagement.DTOs.Requests;

namespace ClinicManagement.API.Controllers
{
    [Route("hoadon")]
    [ApiController]
    public class InvoiceController : ControllerBase
    {
        private readonly ICreateInvoiceHandler _create;
        private readonly IUpdateInvoiceHandler _update;
        private readonly IDeleteInvoiceHandler _delete;
        private readonly IGetInvoiceByIdHandler _getById;
        private readonly ISearchInvoiceHandler _search;

        public InvoiceController(
            ICreateInvoiceHandler create,
            IUpdateInvoiceHandler update,
            IDeleteInvoiceHandler delete,
            IGetInvoiceByIdHandler getById,
            ISearchInvoiceHandler search)
        {
            _create = create;
            _update = update;
            _delete = delete;
            _getById = getById;
            _search = search;
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "SuperAdmin, LeTan, BenhNhan")]
        public async Task<IActionResult> GetById([FromRoute] Guid id)
            => Ok(await _getById.HandleAsync(id));

        [HttpPost]
        [Authorize(Roles = "LeTan")]
        public async Task<IActionResult> Create([FromBody] HoaDonRequest request)
            => Ok(await _create.HandleAsync(request));

        [HttpPut]
        [Authorize(Roles = "SuperAdmin, LeTan")]
        public async Task<IActionResult> Update([FromBody] HoaDonRequest request)
            => Ok(await _update.HandleAsync(request));

        [HttpDelete("{id}")]
        [Authorize(Roles = "SuperAdmin, LeTan")]
        public async Task<IActionResult> Delete([FromRoute] Guid id)
            => Ok(await _delete.HandleAsync(id));

        [HttpPost("search")]
        [Authorize(Roles = "SuperAdmin, LeTan, BenhNhan")]
        public async Task<IActionResult> Search([FromBody] SearchRequest request)
            => Ok(await _search.HandleAsync(request));
    }
}
