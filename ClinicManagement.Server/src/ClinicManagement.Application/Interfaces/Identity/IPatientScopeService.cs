namespace ClinicManagement.Application.Interfaces.Identity
{
    public interface IPatientScopeService
    {
        /// <summary>
        /// Returns null when the caller is not a patient (no row restriction).
        /// For a patient caller returns their own Patient id, or Guid.Empty when no
        /// patient profile is linked to the account (matches nothing).
        /// </summary>
        Task<Guid?> GetRestrictedPatientIdAsync();
    }
}
