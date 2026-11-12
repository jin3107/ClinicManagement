using MayNghien.Infrastructures.Models.Requests;
using ClinicManagement.Domain.Entities;
using System.Linq.Expressions;

namespace ClinicManagement.Application.Interfaces.Repositories
{
    public interface IAppointmentRepository
    {
        Task<Appointment?> GetAsync(Guid id);
        Task AddAsync(Appointment item);
        Task EditAsync(Appointment entity);
        IQueryable<Appointment> FindBy(Expression<Func<Appointment, bool>> predicate);
        Task<int> CountRecordsAsync(Expression<Func<Appointment, bool>> predicate);
        IQueryable<Appointment> AddSort(IQueryable<Appointment> input, SortByInfo sortByInfo);
    }
}
