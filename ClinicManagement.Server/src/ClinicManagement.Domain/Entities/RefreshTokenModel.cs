using System;
using System.ComponentModel.DataAnnotations;

namespace ClinicManagement.Domain.Entities
{
    public class RefreshTokenModel : BaseEntity
    {
        [Key]
        public Guid Id { get; set; }
        public Guid? UserId { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime RefreshTokenExpiryTime { get; set; }
        public bool IsRevoked { get; set; }
    }
}
