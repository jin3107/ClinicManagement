using MayNghien.Infrastructures.Repository;
using ClinicManagement.Application.Interfaces.Repositories;
using ClinicManagement.Domain.Entities;
using ClinicManagement.Infrastructure.Persistence.Data;
using ClinicManagement.Infrastructure.Persistence.Entities;

namespace ClinicManagement.Infrastructure.Persistence.Repositories
{
    public class InvoiceRepository : GenericRepository<Invoice, ApplicationDbContext, ApplicationUser>, IInvoiceRepository
    {
        public InvoiceRepository(ApplicationDbContext context) : base(context) { }
    }
}