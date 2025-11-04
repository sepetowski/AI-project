using System.ComponentModel.DataAnnotations;

namespace LibraryAPI.Models.DTO.Books
{
    public class AddBookReqDTO
    {
        [Required]
        public Guid AuthorId { get; set; }

        [Required]
        public string BookDescripton { get; set; } = string.Empty;

        [Required]
        public string Title { get; set; } = string.Empty;

        [Required,Range(1,5000)]
        public int NumberOfPage { get; set; }

        [Required]
        public  DateTime PublicationDate { get; set; }

        public IFormFile? ImageFile { get; set; }

        [Required,Range(0,100)]
        public int AvailableCopies { get; set; }

        public List<Guid>? CategoriesIds { get; set; }


    }
}
