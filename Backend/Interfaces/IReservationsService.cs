using LibraryAPI.Models.DTO.Reservations;

namespace LibraryAPI.Interfaces
{
    public interface IReservationsService
    {

        Task<CreateReservationResDTO?> CreateReservationAsync(CreateReservationReqDTO req);
        Task<CancelReservationResDTO?> CancelReservationAsync(CancelReservationReqDTO req);
        Task<GetAllReservationsResDTO> GetAllReservationsAsync();
        Task<GetUserReservationsResDTO?> GetUserReservationsAsync(Guid id);
       
    }
}
