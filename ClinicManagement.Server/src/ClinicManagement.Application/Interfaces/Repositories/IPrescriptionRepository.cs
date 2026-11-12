using MayNghien.Infrastructures.Models.Requests;
using ClinicManagement.Domain.Entities;
using System.Linq.Expressions;

namespace ClinicManagement.Application.Interfaces.Repositories
{
    public interface IPrescriptionRepository
    {
        Task<Prescription?> GetAsync(Guid id);
        Task AddAsync(Prescription item);
        Task EditAsync(Prescription entity);
        IQueryable<Prescription> FindBy(Expression<Func<Prescription, bool>> predicate);
        Task<int> CountRecordsAsync(Expression<Func<Prescription, bool>> predicate);
        IQueryable<Prescription> AddSort(IQueryable<Prescription> input, SortByInfo sortByInfo);
    }
}
