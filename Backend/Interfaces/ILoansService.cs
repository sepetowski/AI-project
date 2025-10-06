using LibraryAPI.Models.DTO.Loan;

namespace LibraryAPI.Interfaces
{
    public interface ILoansService
    {

        Task<CreateLoanResDTO?> CreateLoanAsync(CreateLoanReqDTO req);
        Task<ReturnLoanResDTO?> ReturnLoanAsync(ReturnLoanReqDTO req);
        Task<GetAllLoansResDTO?> GetAllLoansAsync();
        Task<GetUserLoansResDTO?> GetUserLoansAsync(Guid id);

    }
}
