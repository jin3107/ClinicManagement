using Microsoft.EntityFrameworkCore;
using ClinicManagement.Application.Interfaces.Identity;
using ClinicManagement.Application.Interfaces.Repositories;

namespace ClinicManagement.Application.Services
{
    public class PatientScopeService : IPatientScopeService
    {
        private readonly ICurrentUserService _currentUser;
        private readonly IPatientRepository _patientRepo;
        private bool _resolved;
        private Guid? _cached;

        public PatientScopeService(ICurrentUserService currentUser, IPatientRepository patientRepo)
        {
            _currentUser = currentUser;
            _patientRepo = patientRepo;
        }

        public async Task<Guid?> GetRestrictedPatientIdAsync()
        {
            if (_resolved) return _cached;

            if (_currentUser.GetRole() != "BenhNhan")
            {
                _cached = null;
            }
            else
            {
                var userId = _currentUser.GetUserId();
                _cached = string.IsNullOrEmpty(userId)
                    ? Guid.Empty
                    : await _patientRepo.FindBy(p => p.MaTK == userId && p.IsDeleted == false)
                        .Select(p => p.MaBN)
                        .FirstOrDefaultAsync();
            }

            _resolved = true;
            return _cached;
        }
    }
}
