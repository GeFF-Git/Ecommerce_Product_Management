using Application_Layer.Interfaces;
using Application_Layer.Models;
using AutoMapper;
using Domain_Layer.Interfaces;
using Infrastructure_Layer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application_Layer.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IConfigurationProvider _configurationProvider;

        public CategoryService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _configurationProvider = _mapper.ConfigurationProvider;
        }

        public async Task<IEnumerable<CategoryDto>> GetAllCategoriesAsync() => _mapper.Map<IEnumerable<CategoryDto>>(await _unitOfWork.Categories.GetAllWithAttributesAsync());
        public async Task<CategoryDto?> GetCategoryByIdAsync(int id) => _mapper.Map<CategoryDto>(await _unitOfWork.Categories.GetCategoryWithAttributesAsync(id));

        public async Task<IEnumerable<Category>> GetAllCategoriesAsyncWithModel()
        {
            var categories = await _unitOfWork.Categories.GetAllAsync();
            return _mapper.Map<IEnumerable<Category>>(categories);
        }

        public async Task<Category?> GetCategoryByIdAsyncWithModel(int id)
        {
            var category = await _unitOfWork.Categories.GetCategoryWithAttributesAsync(id);
            if (category == null) return null;
            return _mapper.Map<Category>(category);
        }

        public async Task<CategoryDto> CreateCategoryAsync(CreateCategoryDto createCategoryDto)
        {
            var category = _mapper.Map<Infrastructure_Layer.Category>(createCategoryDto);
            if (createCategoryDto.Attributes != null && createCategoryDto.Attributes.Any())
            {
                category.CategoryAttributes = _mapper.Map<ICollection<Infrastructure_Layer.CategoryAttribute>>(createCategoryDto.Attributes);
            }
            await _unitOfWork.Categories.AddAsync(category);
            await _unitOfWork.CompleteAsync();
            return _mapper.Map<CategoryDto>(category);
        }

        public async Task<Category> CreateCategoryAsync(Category createCategoryDto)
        {
            // Instead of mapping the entire complex DTO, we manually create the entity.
            // This is safer and avoids the complex mapping issue.
            var categoryEntity = new Infrastructure_Layer.Category
            {
                // We only map the properties that the client is allowed to set.
                CategoryName = createCategoryDto.CategoryName,
                CategoryDescription = createCategoryDto.CategoryDescription
                // We let the database handle default values for IsActive, CreatedDate, etc.
            };

            await _unitOfWork.Categories.AddAsync(categoryEntity);
            await _unitOfWork.CompleteAsync();

            // After saving, we map the fully populated entity back to a DTO to return it.
            return _mapper.Map<Category>(categoryEntity);
        }

        public async Task<CategoryAttributeDto> AddAttributeToCategoryAsync(int categoryId, CreateCategoryAttributeDto attributeDto)
        {
            if (await _unitOfWork.Categories.GetByIdAsync(categoryId) == null) throw new InvalidOperationException("Category not found.");
            var newAttribute = _mapper.Map<Infrastructure_Layer.CategoryAttribute>(attributeDto);
            newAttribute.CategoryId = categoryId;

            var category = await _unitOfWork.Categories.GetByIdAsync(categoryId);
            if (category.CategoryAttributes == null)
                category.CategoryAttributes = new List<Infrastructure_Layer.CategoryAttribute>();
            category.CategoryAttributes.Add(_mapper.Map<Infrastructure_Layer.CategoryAttribute>(newAttribute));

            _unitOfWork.Categories.Update(category);
            await _unitOfWork.CompleteAsync();
            return _mapper.Map<CategoryAttributeDto>(newAttribute);
        }

        public async Task<bool> UpdateCategoryAsync(int id, UpdateCategoryDto categoryDto)
        {
            var category = await _unitOfWork.Categories.GetByIdAsync(id);
            if (category == null) return false;

            // Use AutoMapper to update the existing entity
            _mapper.Map(categoryDto, category);
            category.ModifiedDate = DateTime.UtcNow;

            _unitOfWork.Categories.Update(category);
            await _unitOfWork.CompleteAsync();
            return true;
        }

        public async Task<bool> DeleteCategoryAsync(int id)
        {
            var category = await _unitOfWork.Categories.GetByIdAsync(id);
            if (category == null) return false;

            // This is a soft delete, adhering to business rules.
            category.IsActive = false;
            category.ModifiedDate = DateTime.UtcNow;

            _unitOfWork.Categories.Update(category);
            await _unitOfWork.CompleteAsync();
            return true;
        }

        public async Task<bool> EnableCategoryAsync(int id)
        {
            var category = await _unitOfWork.Categories.GetByIdAsync(id);
            if (category == null) return false;

            category.IsActive = true;
            category.ModifiedDate = DateTime.UtcNow;

            _unitOfWork.Categories.Update(category);
            await _unitOfWork.CompleteAsync();
            return true;
        }

        public async Task<CategoryAttribute> AddAttributeToCategoryAsyncWithModel(int categoryId, CreateCategoryAttributeDto attributeDto)
        {
            var category = await _unitOfWork.Categories.GetByIdAsync(categoryId);
            if (category == null)
            {
                throw new InvalidOperationException("Category not found.");
            }

            var newAttribute = _mapper.Map<Infrastructure_Layer.CategoryAttribute>(attributeDto);
            newAttribute.CategoryId = categoryId;

            // EF Core is smart enough to know this is an addition to the category's collection
            category.CategoryAttributes.Add(newAttribute);

            await _unitOfWork.CompleteAsync();

            return _mapper.Map<CategoryAttribute>(newAttribute);
        }

        public async Task<bool> UpdateCategoryAttributeAsync(int attributeId, UpdateCategoryAttributeDto attributeDto)
        {
            var attribute = await _unitOfWork.CategoryAttributes.GetByIdAsync(attributeId);
            if (attribute == null || attribute.IsActive != true) return false;

            _mapper.Map(attributeDto, attribute);
            attribute.ModifiedDate = DateTime.UtcNow;
            _unitOfWork.CategoryAttributes.Update(attribute);
            await _unitOfWork.CompleteAsync();
            return true;
        }

        public async Task<bool> DeleteCategoryAttributeAsync(int attributeId)
        {
            var attribute = await _unitOfWork.CategoryAttributes.GetByIdAsync(attributeId);
            if (attribute == null) return false;

            attribute.IsActive = false; // Soft delete
            attribute.ModifiedDate = DateTime.UtcNow;
            _unitOfWork.CategoryAttributes.Update(attribute);
            await _unitOfWork.CompleteAsync();
            return true;
        }

        public async Task<bool> EnableCategoryAttributeAsync(int attributeId)
        {
            var attribute = await _unitOfWork.CategoryAttributes.GetByIdAsync(attributeId);
            if (attribute == null) return false;

            attribute.IsActive = true;
            attribute.ModifiedDate = DateTime.UtcNow;
            _unitOfWork.CategoryAttributes.Update(attribute);
            await _unitOfWork.CompleteAsync();
            return true;
        }
    }
}
