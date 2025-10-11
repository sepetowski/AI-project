using LibraryAPI.Models.DTO.Auth;

namespace LibraryAPI.Interfaces
{
    public interface IAuthSerivce
    {
        Task<UserRegisterResDTO?> CreateNewUserAsync(UserRegisterReqDTO req);
        Task<UserLoginResDTO?> LoginUserAsync(UserLoginReqDTO req);
        Task<RefreshTokenResDTO?> GenerateRefreshTokenAsync(string refreshToken);
        Task<GetAllUsersResDTO> GetAllUsersAsync();
        Task<UpdateUserResDTO?> UpdateUserAsync(Guid id,UpdateUserReqDTO req);
    }
}
