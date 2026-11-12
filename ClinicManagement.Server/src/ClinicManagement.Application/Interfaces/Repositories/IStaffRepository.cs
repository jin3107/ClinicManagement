using MayNghien.Infrastructures.Models.Requests;
using ClinicManagement.Domain.Entities;
using System.Linq.Expressions;

namespace ClinicManagement.Application.Interfaces.Repositories
{
    public interface IStaffRepository
    {
        Task<Staff?> GetAsync(Guid id);
        Task AddAsync(Staff item);
        Task EditAsync(Staff entity);
        Task DeleteAsync(Staff entity);
        IQueryable<Staff> FindBy(Expression<Func<Staff, bool>> predicate);
        Task<int> CountRecordsAsync(Expression<Func<Staff, bool>> predicate);
        IQueryable<Staff> AddSort(IQueryable<Staff> input, SortByInfo sortByInfo);
    }
}
