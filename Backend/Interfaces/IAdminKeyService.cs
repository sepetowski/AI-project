using LibraryAPI.Models.DTO.Auth;

namespace LibraryAPI.Interfaces
{
    public interface IAdminKeyService
    {
        Task<AdminKeyDTO?> GetAsync(CancellationToken ct);
        Task<AdminKeyDTO> RotateNowAsync(CancellationToken ct);
    }
}
