using System.ComponentModel.DataAnnotations;

namespace LibraryAPI.Models.DTO.Categories
{
    public class UpdateCategoryReqDTO
    {

        [MinLength(4), MaxLength(50), Required]
        public string Name { get; set; }
    }
}
