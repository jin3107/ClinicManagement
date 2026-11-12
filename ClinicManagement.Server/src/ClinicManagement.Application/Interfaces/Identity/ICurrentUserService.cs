namespace ClinicManagement.Application.Interfaces.Identity
{
    public interface ICurrentUserService
    {
        string? GetEmail();

        string? GetUserId();

        string? GetRole();
    }
}
