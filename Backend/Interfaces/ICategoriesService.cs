using LibraryAPI.Models.DTO.Categories;

namespace LibraryAPI.Interfaces
{
    public interface ICategoriesService
    {

        Task<AddCategoryResDTO?> AddCategoryAsync(AddCategoryReqDTO category);
        Task<DeleteCategoryResDTO?> DeleteCategoryAsync(Guid id);
        Task<GetAllCategoriesResDTO> GetAllCategoriesAsync();
        Task<UpdateCategoryResDTO?> UpdateCategoryAsync(Guid id, UpdateCategoryReqDTO category);
        Task<CategoryDTO?> GetCategoryAsync(Guid id);
    }
}
