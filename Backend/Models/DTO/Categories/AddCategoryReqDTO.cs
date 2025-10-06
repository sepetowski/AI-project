using System.ComponentModel.DataAnnotations;

namespace LibraryAPI.Models.DTO.Categories
{
    public class AddCategoryReqDTO
    {
        [Required]
        public string Name { get; set; }
    }
}
