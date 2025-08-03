using Application_Layer;
using Application_Layer.Interfaces;
using Application_Layer.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Product_Management_Service.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;
        public ProductsController(IProductService productService) => _productService = productService;

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                return Ok(await _productService.GetAllProductsAsync());
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An unexpected error occurred.");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var product = await _productService.GetProductByIdAsync(id);
                return product == null ? NotFound($"Product with ID {id} not found.") : Ok(product);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An unexpected error occurred.");
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateProductDto createProductDto)
        {
            try
            {
                var newProduct = await _productService.CreateProductAsync(createProductDto);
                return CreatedAtAction(nameof(GetById), new { id = newProduct.ProductId }, newProduct);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An unexpected error occurred while creating the product.");
            }
        }

        [HttpPost("{productId}/attributes")]
        public async Task<IActionResult> AddAttribute(int productId, [FromBody] CreateProductAttributeValueDto attributeDto)
        {
            try
            {
                var result = await _productService.AddOrUpdateAttributeForProductAsync(productId, attributeDto);
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message }); // Use 409 Conflict for existing resource
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An unexpected error occurred while adding the attribute value.");
            }
        }

        [HttpPut("{id}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> UpdateProduct(int id, [FromBody] UpdateProductDto productDto)
        {
            try
            {
                var success = await _productService.UpdateProductAsync(id, productDto);
                return success ? NoContent() : NotFound($"Product with ID {id} not found.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An unexpected error occurred while updating the product.");
            }
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            try
            {
                var success = await _productService.DeleteProductAsync(id);
                return success ? NoContent() : NotFound($"Product with ID {id} not found.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An unexpected error occurred while deleting the product.");
            }
        }

        [HttpPut("{productId}/attributes/{attributeId}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> UpdateAttributeValue(int productId, int attributeId, [FromBody] UpdateProductAttributeValueDto attributeDto)
        {
            try
            {
                var success = await _productService.UpdateProductAttributeValueAsync(productId, attributeId, attributeDto);
                return success ? NoContent() : NotFound($"Attribute value for product {productId} and attribute {attributeId} not found.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An unexpected error occurred while updating the attribute value.");
            }
        }

        [HttpDelete("{productId}/attributes/{attributeId}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> DeleteAttributeValue(int productId, int attributeId)
        {
            try
            {
                var success = await _productService.DeleteProductAttributeValueAsync(productId, attributeId);
                return success ? NoContent() : NotFound($"Attribute value for product {productId} and attribute {attributeId} not found.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An unexpected error occurred while deleting the attribute value.");
            }
        }
    }
}
