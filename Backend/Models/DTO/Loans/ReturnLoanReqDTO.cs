using System.ComponentModel.DataAnnotations;

namespace LibraryAPI.Models.DTO.Loan
{
    public class ReturnLoanReqDTO
    {
        [Required]
        public Guid Id { get; set; }
    }
}
