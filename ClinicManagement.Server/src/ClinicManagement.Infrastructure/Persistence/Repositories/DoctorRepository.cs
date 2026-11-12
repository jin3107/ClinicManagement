using MayNghien.Infrastructures.Repository;
using ClinicManagement.Application.Interfaces.Repositories;
using ClinicManagement.Domain.Entities;
using ClinicManagement.Infrastructure.Persistence.Data;
using ClinicManagement.Infrastructure.Persistence.Entities;

namespace ClinicManagement.Infrastructure.Persistence.Repositories
{
    public class DoctorRepository : GenericRepository<Doctor, ApplicationDbContext, ApplicationUser>, IDoctorRepository
    {
        public DoctorRepository(ApplicationDbContext context) : base(context) { }
    }
}