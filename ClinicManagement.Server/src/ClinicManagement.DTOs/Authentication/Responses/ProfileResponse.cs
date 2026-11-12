using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClinicManagement.DTOs.Authentication.Responses
{
    public class ProfileResponse
    {
        public string UserName { get; set; }
        public string Role { get; set; }
        public string? PhoneNumber { get; set; }
    }
}
