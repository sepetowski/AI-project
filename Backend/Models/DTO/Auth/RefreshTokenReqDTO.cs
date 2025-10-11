using System.ComponentModel.DataAnnotations;

namespace LibraryAPI.Models.DTO.Auth
{
    public class RefreshTokenReqDTO
    {
        [Required]
        public string RefreshToken { get; set; }
    }
}
