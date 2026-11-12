using MayNghien.Infrastructures.Models.Requests;
using ClinicManagement.Domain.Entities;
using System.Linq.Expressions;

namespace ClinicManagement.Application.Interfaces.Repositories
{
    public interface IMedicalServiceRepository
    {
        Task<MedicalService?> GetAsync(Guid id);
        Task AddAsync(MedicalService item);
        Task EditAsync(MedicalService entity);
        IQueryable<MedicalService> FindBy(Expression<Func<MedicalService, bool>> predicate);
        Task<int> CountRecordsAsync(Expression<Func<MedicalService, bool>> predicate);
        IQueryable<MedicalService> AddSort(IQueryable<MedicalService> input, SortByInfo sortByInfo);
    }
}
