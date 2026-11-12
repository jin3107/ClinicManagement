using ClinicManagement.Domain.Entities;
using System.Linq.Expressions;

namespace ClinicManagement.Application.Interfaces.Repositories
{
    public interface IPrescriptionDetailRepository
    {
        Task<PrescriptionDetail?> GetAsync(Guid id);
        Task AddAsync(PrescriptionDetail item);
        Task AddRangeAsync(List<PrescriptionDetail> items, bool isCommit = true);
        Task EditAsync(PrescriptionDetail entity);
        Task EditRangeAsync(List<PrescriptionDetail> items);
        IQueryable<PrescriptionDetail> FindBy(Expression<Func<PrescriptionDetail, bool>> predicate);
    }
}
