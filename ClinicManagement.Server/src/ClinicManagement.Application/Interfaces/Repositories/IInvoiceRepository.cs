using MayNghien.Infrastructures.Models.Requests;
using ClinicManagement.Domain.Entities;
using System.Linq.Expressions;

namespace ClinicManagement.Application.Interfaces.Repositories
{
    public interface IInvoiceRepository
    {
        Task<Invoice?> GetAsync(Guid id);
        Task AddAsync(Invoice item);
        Task EditAsync(Invoice entity);
        IQueryable<Invoice> FindBy(Expression<Func<Invoice, bool>> predicate);
        Task<int> CountRecordsAsync(Expression<Func<Invoice, bool>> predicate);
        IQueryable<Invoice> AddSort(IQueryable<Invoice> input, SortByInfo sortByInfo);
    }
}
