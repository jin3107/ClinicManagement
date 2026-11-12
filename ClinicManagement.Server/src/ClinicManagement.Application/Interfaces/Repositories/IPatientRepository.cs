using MayNghien.Infrastructures.Models.Requests;
using ClinicManagement.Domain.Entities;
using System.Linq.Expressions;

namespace ClinicManagement.Application.Interfaces.Repositories
{
    public interface IPatientRepository
    {
        Task<Patient?> GetAsync(Guid id);
        Task AddAsync(Patient item);
        Task EditAsync(Patient entity);
        IQueryable<Patient> FindBy(Expression<Func<Patient, bool>> predicate);
        Task<int> CountRecordsAsync(Expression<Func<Patient, bool>> predicate);
        IQueryable<Patient> AddSort(IQueryable<Patient> input, SortByInfo sortByInfo);
    }
}
