using Microsoft.AspNetCore.Identity;
using ClinicManagement.Commons.Enum;

namespace ClinicManagement.Application.Interfaces.Identity
{
    public interface IIdentityUserService
    {
        Task<string?> GetEmailByIdAsync(string userId);
        Task<string?> GetUserIdByEmailAsync(string email);
        Task<Dictionary<string, string?>> GetEmailsByIdsAsync(IEnumerable<string> userIds);

        Task<(IdentityResult Result, string? UserId)> CreateUserAsync(
            string email, string? phoneNumber, string? fullName, string password, Role role);

        Task<IdentityResult> UpdateUserAsync(
            string userId, string email, string? phoneNumber, string? fullName, Role role, string? newPassword = null);

        Task<IdentityResult> DeleteUserAsync(string userId);

        Task<bool> UserExistsAsync(string email, string? phoneNumber, string? ignoreUserId = null);

        Task AssignRoleAsync(string userId, string roleName);
    }
}
