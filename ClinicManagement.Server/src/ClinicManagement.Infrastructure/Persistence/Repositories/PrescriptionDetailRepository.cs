using MayNghien.Infrastructures.Repository;
using ClinicManagement.Application.Interfaces.Repositories;
using ClinicManagement.Domain.Entities;
using ClinicManagement.Infrastructure.Persistence.Data;
using ClinicManagement.Infrastructure.Persistence.Entities;

namespace ClinicManagement.Infrastructure.Persistence.Repositories
{
    public class PrescriptionDetailRepository : GenericRepository<PrescriptionDetail, ApplicationDbContext, ApplicationUser>, IPrescriptionDetailRepository
    {
        public PrescriptionDetailRepository(ApplicationDbContext context) : base(context) { }

        public async Task EditRangeAsync(List<PrescriptionDetail> items)
        {
            if (items.Count == 0) return;
            DbContext.UpdateRange(items);
            await DbContext.SaveChangesAsync();
        }
    }
}