using ClinicManagement.Domain.Entities;

namespace ClinicManagement.Application.Interfaces.Repositories
{
    public interface IOtpCodeRepository
    {
        Task AddAsync(OtpCode entity);
        Task UpdateAsync(OtpCode entity);
        Task<OtpCode?> FindActiveAsync(string email);
        Task<OtpCode?> FindRecentlyVerifiedAsync(string email);
        Task InvalidatePreviousAsync(string email);
        Task ClearExpiredAsync();
    }
}
