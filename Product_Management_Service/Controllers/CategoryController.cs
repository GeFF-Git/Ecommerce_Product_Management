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

        public CategoriesController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpGet]
        [ProducesResponseType(200)]
        public async Task<IActionResult> Get()
        {
            var categories = await _categoryService.GetAllCategoriesAsync();
            return Ok(categories);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> Get(int id)
        {
            var category = await _categoryService.GetCategoryByIdAsync(id);
            if (category == null)
            {
                return NotFound();
            }
            return Ok(category);
        }

        [HttpPost]
        [ProducesResponseType(201)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> Post([FromBody] CreateCategoryDto createCategoryDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var newCategory = await _categoryService.CreateCategoryAsync(createCategoryDto);
            return CreatedAtAction(nameof(Get), new { id = newCategory.CategoryId }, newCategory);
        }

        [HttpPut("{id}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> Put(int id, [FromBody] UpdateCategoryDto categoryDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var success = await _categoryService.UpdateCategoryAsync(id, categoryDto);
            if (!success)
            {
                return NotFound();
            }
            return NoContent();
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _categoryService.DeleteCategoryAsync(id);
            if (!success)
            {
                return NotFound();
            }
            return NoContent();
        }

        [HttpPatch("{id}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> Enable(int id)
        {
            var success = await _categoryService.EnableCategoryAsync(id);
            if (!success)
            {
                return NotFound();
            }
            return NoContent();
        }

        // This endpoint allows adding an attribute to an already existing category.
        [HttpPost("{categoryId}/attributes")]
        [ProducesResponseType(typeof(CategoryAttribute), 201)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> AddAttribute(int categoryId, [FromBody] CreateCategoryAttributeDto attributeDto)
        {
            try
            {
                var newAttribute = await _categoryService.AddAttributeToCategoryAsync(categoryId, attributeDto);
                // A more correct RESTful response would be to point to a new "GetAttribute" endpoint
                return CreatedAtAction(nameof(Get), new { id = categoryId }, newAttribute);
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(ex.Message);
            }
        }
        [HttpPut("attributes/{attributeId}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> UpdateAttribute(int attributeId, [FromBody] UpdateCategoryAttributeDto attributeDto)
        {
            var success = await _categoryService.UpdateCategoryAttributeAsync(attributeId, attributeDto);
            return success ? NoContent() : NotFound();
        }

        [HttpDelete("attributes/{attributeId}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> DeleteAttribute(int attributeId)
        {
            var success = await _categoryService.DeleteCategoryAttributeAsync(attributeId);
            return success ? NoContent() : NotFound();
        }

        [HttpPatch("attributes/{attributeId}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> EnableAttribute(int attributeId)
        {
            var success = await _categoryService.EnableCategoryAttributeAsync(attributeId);
            return success ? NoContent() : NotFound();
        }
    }

}
