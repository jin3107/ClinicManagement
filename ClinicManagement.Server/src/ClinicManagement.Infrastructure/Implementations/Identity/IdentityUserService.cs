using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ClinicManagement.Application.Interfaces.Identity;
using ClinicManagement.Commons.Enum;
using ClinicManagement.Infrastructure.Persistence.Entities;

namespace ClinicManagement.Infrastructure.Implementations.Identity
{
    public class IdentityUserService : IIdentityUserService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public IdentityUserService(UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }

        public async Task<string?> GetEmailByIdAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            return user?.Email;
        }

        public async Task<string?> GetUserIdByEmailAsync(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            return user?.Id;
        }

        public async Task<Dictionary<string, string?>> GetEmailsByIdsAsync(IEnumerable<string> userIds)
        {
            var ids = userIds.ToList();
            if (!ids.Any()) return new Dictionary<string, string?>();

            var users = await _userManager.Users
                .Where(u => ids.Contains(u.Id))
                .Select(u => new { u.Id, u.Email })
                .ToListAsync();

            return users.ToDictionary(u => u.Id, u => u.Email);
        }

        public async Task<(IdentityResult Result, string? UserId)> CreateUserAsync(
            string email, string? phoneNumber, string? fullName, string password, Role role)
        {
            var user = new ApplicationUser
            {
                UserName = email,
                Email = email,
                EmailConfirmed = true,
                SecurityStamp = Guid.NewGuid().ToString(),
                PhoneNumber = phoneNumber,
                FullName = fullName,
                Role = role,
            };

            var result = await _userManager.CreateAsync(user, password);
            return (result, result.Succeeded ? user.Id : null);
        }

        public async Task<IdentityResult> UpdateUserAsync(
            string userId, string email, string? phoneNumber, string? fullName, Role role, string? newPassword = null)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return IdentityResult.Failed(new IdentityError { Description = "User not found." });

            user.Email = email;
            user.UserName = email;
            user.PhoneNumber = phoneNumber;
            user.FullName = fullName;
            user.Role = role;

            var updateResult = await _userManager.UpdateAsync(user);
            if (!updateResult.Succeeded) return updateResult;

            if (!string.IsNullOrEmpty(newPassword))
            {
                var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                var passwordResult = await _userManager.ResetPasswordAsync(user, token, newPassword);
                if (!passwordResult.Succeeded) return passwordResult;
            }

            return IdentityResult.Success;
        }

        public async Task<IdentityResult> DeleteUserAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return IdentityResult.Success; // idempotent
            return await _userManager.DeleteAsync(user);
        }

        public async Task<bool> UserExistsAsync(string email, string? phoneNumber, string? ignoreUserId = null)
        {
            var byEmail = await _userManager.FindByEmailAsync(email);
            if (byEmail != null && byEmail.Id != ignoreUserId) return true;

            if (!string.IsNullOrEmpty(phoneNumber))
            {
                var byPhone = await _userManager.Users
                    .FirstOrDefaultAsync(u => u.PhoneNumber == phoneNumber);
                if (byPhone != null && byPhone.Id != ignoreUserId) return true;
            }

            return false;
        }

        public async Task AssignRoleAsync(string userId, string roleName)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return;

            var currentRoles = await _userManager.GetRolesAsync(user);
            await _userManager.RemoveFromRolesAsync(user, currentRoles);

            if (!await _roleManager.RoleExistsAsync(roleName))
                await _roleManager.CreateAsync(new IdentityRole(roleName));

            await _userManager.AddToRoleAsync(user, roleName);
        }
    }
}
