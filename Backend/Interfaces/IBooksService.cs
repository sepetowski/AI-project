
using LibraryAPI.Models.DTO.Books;

namespace LibraryAPI.Interfaces
{
    public interface IBooksService
    {

        Task<AddBookResDTO?> AddBookAsync(AddBookReqDTO req);
        Task<GetAllBooksResDTO> GetAllBooksAsync();
        Task<GetBookDetailsResDTO?> GetBookDetailsAsync(Guid id);
        Task<DeleteBookResDTO?> DeleteBookResAsync(Guid id);

        Task<UpdateBookResDTO?> UpdateBookAsync(UpdateBookReqDTO req);
    }
}
