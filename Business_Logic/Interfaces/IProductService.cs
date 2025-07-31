using Application_Layer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application_Layer.Interfaces
{
    public interface IProductService
    {
        Task<IEnumerable<Product>> GetAllProductsAsyncWithModel();
        Task<Product?> GetProductByIdAsyncWithModel(int id);
        //Task<Product> CreateProductAsync(Product createProductDto);
        Task<ProductDto> CreateProductAsync(CreateProductDto createProductDto);
        Task<bool> UpdateProductAsync(int id, Product productDto);
        Task<bool> DeleteProductAsync(int id);
        Task<ProductAttribute> AddOrUpdateAttributeForProductAsync(int productId, CreateProductAttributeValueDto attributeDto);
        Task<IEnumerable<ProductDto>> GetAllProductsAsync();
        Task<ProductDto?> GetProductByIdAsync(int id);
    }
}
