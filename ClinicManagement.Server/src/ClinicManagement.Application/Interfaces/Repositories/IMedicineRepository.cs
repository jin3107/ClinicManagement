using MayNghien.Infrastructures.Models.Requests;
using ClinicManagement.Domain.Entities;
using System.Linq.Expressions;

namespace ClinicManagement.Application.Interfaces.Repositories
{
    public interface IMedicineRepository
    {
        Task<Medicine?> GetAsync(Guid id);
        Task AddAsync(Medicine item);
        Task EditAsync(Medicine entity);
        IQueryable<Medicine> FindBy(Expression<Func<Medicine, bool>> predicate);
        Task<int> CountRecordsAsync(Expression<Func<Medicine, bool>> predicate);
        IQueryable<Medicine> AddSort(IQueryable<Medicine> input, SortByInfo sortByInfo);
    }
}
