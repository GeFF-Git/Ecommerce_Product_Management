using Application_Layer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application_Layer.Interfaces
{
    public interface ICategoryService
    {
        Task<CategoryDto> CreateCategoryAsync(CreateCategoryDto createCategoryDto);
        Task<bool> UpdateCategoryAsync(int id, UpdateCategoryDto categoryDto);
        Task<bool> DeleteCategoryAsync(int id);
        Task<bool> EnableCategoryAsync(int id);
        Task<CategoryAttribute> AddAttributeToCategoryAsyncWithModel(int categoryId, CreateCategoryAttributeDto attributeDto);
        Task<CategoryDto?> GetCategoryByIdAsync(int id);
        Task<IEnumerable<CategoryDto>> GetAllCategoriesAsync();
        Task<CategoryAttributeDto> AddAttributeToCategoryAsync(int categoryId, CreateCategoryAttributeDto attributeDto);
        Task<bool> UpdateCategoryAttributeAsync(int attributeId, UpdateCategoryAttributeDto attributeDto);
        Task<bool> DeleteCategoryAttributeAsync(int attributeId);
        Task<bool> EnableCategoryAttributeAsync(int attributeId);
    }
}
