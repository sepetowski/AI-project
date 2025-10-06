using System.ComponentModel.DataAnnotations;

namespace LibraryAPI.Models.DTO.Reservations
{
    public class CancelReservationReqDTO
    {
        [Required]
        public Guid Id { get; set; }
    }
}
