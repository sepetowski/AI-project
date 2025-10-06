using LibraryAPI.Models.DTO.Loan;

namespace LibraryAPI.Models.DTO.Reservations
{
    public class GetAllReservationsResDTO
    {
        public required List<ReservationDTO> Reservations { get; set; }
        public required int Amount { get; set; }
    }
}
