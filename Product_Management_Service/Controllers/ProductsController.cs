using Application_Layer.Interfaces;
using Application_Layer;
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
        [ProducesResponseType(typeof(IEnumerable<Application_Layer.Product>), 200)]
        public async Task<IActionResult> Get()
        {
            var products = await _productService.GetAllProductsAsync();
            Console.WriteLine(products);
            return Ok(products);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(Application_Layer.Product), 200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> Get(int id)
        {
            var product = await _productService.GetProductByIdAsync(id);
            if (product == null)
            {
                return NotFound();
            }
            return Ok(product);
        }

        [HttpPost]
        [ProducesResponseType(typeof(Application_Layer.Product), 201)]
        [ProducesResponseType(400)]
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
        public async Task<IActionResult> Put(int id, [FromBody] Application_Layer.Product productDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var success = await _productService.UpdateProductAsync(id, productDto);
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
            var success = await _productService.DeleteProductAsync(id);
            if (!success)
            {
                return NotFound();
            }
            return NoContent();
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
    }
}
