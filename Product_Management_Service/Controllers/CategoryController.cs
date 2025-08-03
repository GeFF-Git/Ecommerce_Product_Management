using Application_Layer;
using Application_Layer.Interfaces;
using Application_Layer.Models;
using Microsoft.AspNetCore.Mvc;

namespace Product_Management_Service.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryService _categoryService;
        public CategoriesController(ICategoryService categoryService) => _categoryService = categoryService;

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var categories = await _categoryService.GetAllCategoriesAsync();
                return Ok(categories);
            }
            catch (Exception ex)
            {
                // In a real app, log the exception ex
                return StatusCode(500, "An unexpected error occurred.");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var category = await _categoryService.GetCategoryByIdAsync(id);
                return category == null ? NotFound($"Category with ID {id} not found.") : Ok(category);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An unexpected error occurred.");
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateCategoryDto createCategoryDto)
        {
            try
            {
                var newCategory = await _categoryService.CreateCategoryAsync(createCategoryDto);
                return CreatedAtAction(nameof(GetById), new { id = newCategory.CategoryId }, newCategory);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An unexpected error occurred while creating the category.");
            }
        }

        [HttpPost("{categoryId}/attributes")]
        public async Task<IActionResult> AddAttribute(int categoryId, [FromBody] CreateCategoryAttributeDto attributeDto)
        {
            try
            {
                var newAttribute = await _categoryService.AddAttributeToCategoryAsync(categoryId, attributeDto);
                return CreatedAtAction(nameof(GetById), new { id = categoryId }, newAttribute);
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An unexpected error occurred while adding the attribute.");
            }
        }

        [HttpPut("{id}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> UpdateCategory(int id, [FromBody] UpdateCategoryDto categoryDto)
        {
            try
            {
                var success = await _categoryService.UpdateCategoryAsync(id, categoryDto);
                return success ? NoContent() : NotFound($"Category with ID {id} not found.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An unexpected error occurred while updating the category.");
            }
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            try
            {
                var success = await _categoryService.DeleteCategoryAsync(id);
                return success ? NoContent() : NotFound($"Category with ID {id} not found.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An unexpected error occurred while deleting the category.");
            }
        }

        [HttpPut("attributes/{attributeId}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> UpdateAttribute(int attributeId, [FromBody] UpdateCategoryAttributeDto attributeDto)
        {
            try
            {
                var success = await _categoryService.UpdateCategoryAttributeAsync(attributeId, attributeDto);
                return success ? NoContent() : NotFound($"Attribute with ID {attributeId} not found.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An unexpected error occurred while updating the attribute.");
            }
        }

        [HttpDelete("attributes/{attributeId}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> DeleteAttribute(int attributeId)
        {
            try
            {
                var success = await _categoryService.DeleteCategoryAttributeAsync(attributeId);
                return success ? NoContent() : NotFound($"Attribute with ID {attributeId} not found.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An unexpected error occurred while deleting the attribute.");
            }
        }
    }

}
