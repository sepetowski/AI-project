using System.ComponentModel.DataAnnotations;

namespace LibraryAPI.Models.DTO.Categories
{
    public class UpdateCategoryReqDTO
    {
      
        [Required]
        public string Name { get; set; }
    }
}
