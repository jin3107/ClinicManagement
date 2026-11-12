using Microsoft.AspNetCore.Identity;
using ClinicManagement.Commons.Enum;

namespace ClinicManagement.Infrastructure.Persistence.Entities
{
    public class ApplicationUser : IdentityUser
    {
        public string? TrangThai { get; set; }
        public Role? Role { get; set; }
        public string? FullName { get; set; }
    }
}
