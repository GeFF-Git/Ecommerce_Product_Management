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

        public ProductsController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _productService.GetAllProductsAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var product = await _productService.GetProductByIdAsync(id);
            return product == null ? NotFound() : Ok(product);
        }

        [HttpPost]  
        public async Task<IActionResult> Post([FromBody] Application_Layer.Models.CreateProductDto  createProductDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var newProduct = await _productService.CreateProductAsync(createProductDto);
            return Ok(newProduct);
        }

        [HttpPut("{id}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> Put(int id, [FromBody] UpdateProductDto productDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var success = await _productService.UpdateProductAsync(id, productDto);
            return success ? NoContent() : NotFound();
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _productService.DeleteProductAsync(id);
            return success ? NoContent() : NotFound();
        }

        [HttpPatch("{id}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> Enable(int id)
        {
            var success = await _productService.EnableProductAsync(id);
            return success ? NoContent() : NotFound();
        }

        [HttpPost("{productId}/attributes")]
        public async Task<IActionResult> AddOrUpdateAttribute(int productId, [FromBody] Application_Layer.Models.CreateProductAttributeValueDto attributeDto)
        {
            try
            {
                var result = await _productService.AddOrUpdateAttributeForProductAsync(productId, attributeDto);
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpPut("{productId}/attributes/{attributeId}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> UpdateAttributeValue(int productId, int attributeId, [FromBody] UpdateProductAttributeValueDto attributeDto)
        {
            var success = await _productService.UpdateProductAttributeValueAsync(productId, attributeId, attributeDto);
            return success ? NoContent() : NotFound();
        }

        // *** NEW ENDPOINT FOR DELETING ***
        [HttpDelete("{productId}/attributes/{attributeId}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> DeleteAttributeValue(int productId, int attributeId)
        {
            var success = await _productService.DeleteProductAttributeValueAsync(productId, attributeId);
            return success ? NoContent() : NotFound();
        }
    }
}
