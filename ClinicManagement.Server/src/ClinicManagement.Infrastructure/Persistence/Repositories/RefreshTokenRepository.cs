using MayNghien.Infrastructures.Repository;
using Microsoft.EntityFrameworkCore;
using ClinicManagement.Application.Interfaces.Repositories;
using ClinicManagement.Domain.Entities;
using ClinicManagement.Infrastructure.Persistence.Data;
using ClinicManagement.Infrastructure.Persistence.Entities;

namespace ClinicManagement.Infrastructure.Persistence.Repositories
{
    public class RefreshTokenRepository : GenericRepository<RefreshTokenModel, ApplicationDbContext, ApplicationUser>, IRefreshTokenRepository
    {
        public RefreshTokenRepository(ApplicationDbContext context) : base(context) { }

        public async Task<RefreshTokenModel?> FindByTokenAsync(string token)
            => await _context.Set<RefreshTokenModel>()
                .FirstOrDefaultAsync(rt => rt.RefreshToken == token && !rt.IsRevoked);

        public async Task RevokeByUserIdAsync(Guid userId)
        {
            var activeTokens = await _context.Set<RefreshTokenModel>()
                .Where(rt => rt.UserId == userId && !rt.IsRevoked)
                .ToListAsync();
            foreach (var token in activeTokens)
                token.IsRevoked = true;
            await _context.SaveChangesAsync();
        }
    }
}
