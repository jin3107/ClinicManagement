using Microsoft.EntityFrameworkCore;
using ClinicManagement.Application.Interfaces.Repositories;
using ClinicManagement.Domain.Entities;
using ClinicManagement.Domain.Enums;
using ClinicManagement.Infrastructure.Persistence.Data;

namespace ClinicManagement.Infrastructure.Persistence.Repositories
{
    public class OtpCodeRepository : IOtpCodeRepository
    {
        private readonly ApplicationDbContext _context;

        public OtpCodeRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(OtpCode entity)
        {
            entity.CreatedOn ??= DateTime.UtcNow;
            entity.CreatedBy ??= "";
            await _context.OtpCodes.AddAsync(entity);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(OtpCode entity)
        {
            _context.OtpCodes.Update(entity);
            await _context.SaveChangesAsync();
        }

        public async Task<OtpCode?> FindActiveAsync(string email)
        {
            var normalizedEmail = email.Trim().ToLowerInvariant();
            return await _context.OtpCodes
                .Where(o => !o.IsDeleted
                    && o.Email == normalizedEmail
                    && o.Purpose == OtpPurpose.ResetPassword
                    && !o.IsUsed
                    && o.ExpiresAt > DateTime.UtcNow)
                .OrderByDescending(o => o.CreatedOn)
                .FirstOrDefaultAsync();
        }

        public async Task<OtpCode?> FindRecentlyVerifiedAsync(string email)
        {
            var normalizedEmail = email.Trim().ToLowerInvariant();
            return await _context.OtpCodes
                .Where(o => !o.IsDeleted
                    && o.Email == normalizedEmail
                    && o.Purpose == OtpPurpose.ResetPassword
                    && o.IsUsed
                    && o.ModifiedOn != null
                    && o.ModifiedOn >= DateTime.UtcNow.AddMinutes(-10))
                .OrderByDescending(o => o.ModifiedOn)
                .FirstOrDefaultAsync();
        }

        public async Task InvalidatePreviousAsync(string email)
        {
            var normalizedEmail = email.Trim().ToLowerInvariant();
            var previous = await _context.OtpCodes
                .Where(o => !o.IsDeleted && o.Email == normalizedEmail
                    && o.Purpose == OtpPurpose.ResetPassword && !o.IsUsed)
                .ToListAsync();
            foreach (var otp in previous)
                otp.IsUsed = true;

            await _context.SaveChangesAsync();
        }

        public async Task ClearExpiredAsync()
        {
            var expired = await _context.OtpCodes
                .Where(o => o.ExpiresAt <= DateTime.UtcNow || o.IsUsed)
                .ToListAsync();
            _context.OtpCodes.RemoveRange(expired);
            await _context.SaveChangesAsync();
        }
    }
}
