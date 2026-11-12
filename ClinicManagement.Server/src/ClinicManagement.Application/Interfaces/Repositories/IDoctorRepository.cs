using MayNghien.Infrastructures.Models.Requests;
using ClinicManagement.Domain.Entities;
using System.Linq.Expressions;

namespace ClinicManagement.Application.Interfaces.Repositories
{
    public interface IDoctorRepository
    {
        Task<Doctor?> GetAsync(Guid id);
        Task AddAsync(Doctor item);
        Task EditAsync(Doctor entity);
        IQueryable<Doctor> FindBy(Expression<Func<Doctor, bool>> predicate);
        Task<int> CountRecordsAsync(Expression<Func<Doctor, bool>> predicate);
        IQueryable<Doctor> AddSort(IQueryable<Doctor> input, SortByInfo sortByInfo);
    }
}
