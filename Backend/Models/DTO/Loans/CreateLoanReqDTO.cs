using System.ComponentModel.DataAnnotations;

namespace LibraryAPI.Models.DTO.Loan
{
    public class CreateLoanReqDTO
    {
        [Required]
        public Guid UserId { get; set; }
        [Required]
        public Guid BookId { get; set; }
    }
}
