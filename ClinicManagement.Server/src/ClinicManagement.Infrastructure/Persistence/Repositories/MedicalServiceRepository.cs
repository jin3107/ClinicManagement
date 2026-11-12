using MayNghien.Infrastructures.Repository;
using ClinicManagement.Application.Interfaces.Repositories;
using ClinicManagement.Domain.Entities;
using ClinicManagement.Infrastructure.Persistence.Data;
using ClinicManagement.Infrastructure.Persistence.Entities;

namespace ClinicManagement.Infrastructure.Persistence.Repositories
{
    public class MedicalServiceRepository : GenericRepository<MedicalService, ApplicationDbContext, ApplicationUser>, IMedicalServiceRepository
    {
        public MedicalServiceRepository(ApplicationDbContext context) : base(context) { }
    }
}