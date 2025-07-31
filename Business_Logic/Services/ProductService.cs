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
    public class ProductService : IProductService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ICategoryService _categoryService;

        public ProductService(IUnitOfWork unitOfWork, IMapper mapper, ICategoryService categoryService)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _categoryService = categoryService;
        }

        public async Task<IEnumerable<ProductDto>> GetAllProductsAsync() => _mapper.Map<IEnumerable<ProductDto>>(await _unitOfWork.Products.GetAllAsync());
        public async Task<ProductDto?> GetProductByIdAsync(int id) => _mapper.Map<ProductDto>(await _unitOfWork.Products.GetProductWithDetailsAsync(id));

        public async Task<IEnumerable<Product>> GetAllProductsAsyncWithModel()
        {
            var products = await _unitOfWork.Products.GetAllAsync();
            return _mapper.Map<IEnumerable<Product>>(products);
        }

        public async Task<Product?> GetProductByIdAsyncWithModel(int id)
        {
            var product = await _unitOfWork.Products.GetProductWithDetailsAsync(id);
            if (product == null) return null;
            return _mapper.Map<Product>(product);
        }

        public async Task<ProductDto> CreateProductAsync(CreateProductDto createProductDto)
        {
            
            var product = _mapper.Map<Infrastructure_Layer.Product>(createProductDto);
            if (createProductDto.Attributes != null && createProductDto.Attributes.Any())
            {
                product.ProductAttributes = _mapper.Map<ICollection<Infrastructure_Layer.ProductAttribute>>(createProductDto.Attributes);
            }
            var categoryExists = await _unitOfWork.Categories.GetByIdAsync(createProductDto.CategoryId);
            if (categoryExists == null)
            {
                throw new InvalidOperationException($"Cannot create product. Category with ID {createProductDto.CategoryId} does not exist.");
            }
            product.Category = null;
            //var category = await _categoryService.GetCategoryByIdAsync(product.CategoryId);
            //product.Category = _mapper.Map<Infrastructure_Layer.Category>(category);
            await _unitOfWork.Products.AddAsync(product);
            await _unitOfWork.CompleteAsync();
            var createdProduct = await _unitOfWork.Products.GetProductWithDetailsAsync(product.ProductId);
            return _mapper.Map<ProductDto>(createdProduct);
        }

        public async Task<bool> UpdateProductAsync(int id, Product productDto)
        {
            var product = await _unitOfWork.Products.GetByIdAsync(id);
            if (product == null) return false;

            _mapper.Map(productDto, product);
            product.ModifiedDate = DateTime.UtcNow;

            _unitOfWork.Products.Update(product);
            await _unitOfWork.CompleteAsync();
            return true;
        }

        public async Task<bool> DeleteProductAsync(int id)
        {
            var product = await _unitOfWork.Products.GetByIdAsync(id);
            if (product == null) return false;

            product.IsActive = false;
            product.ModifiedDate = DateTime.UtcNow;

            _unitOfWork.Products.Update(product);
            await _unitOfWork.CompleteAsync();
            return true;
        }

        // New method implementation for adding/updating a product's attribute value
        public async Task<ProductAttribute> AddOrUpdateAttributeForProductAsync(int productId, CreateProductAttributeValueDto attributeDto)
        {
            var product = await _unitOfWork.Products.GetProductWithDetailsAsync(productId);
            if (product == null)
            {
                throw new InvalidOperationException("Product not found.");
            }

            // Check if the attribute already has a value for this product
            var existingAttribute = product.ProductAttributes
                .FirstOrDefault(pa => pa.AttributeId == attributeDto.AttributeId);

            if (existingAttribute != null)
            {
                // Update existing value
                existingAttribute.AttributeValue = attributeDto.Value;
                existingAttribute.ModifiedDate = DateTime.UtcNow;
            }
            else
            {
                // Add new attribute value
                var newAttributeValue = _mapper.Map<Infrastructure_Layer.ProductAttribute>(attributeDto);
                product.ProductAttributes.Add(newAttributeValue);
            }

            await _unitOfWork.CompleteAsync();

            // Map the result back to a DTO to return
            var updatedAttribute = product.ProductAttributes.First(pa => pa.AttributeId == attributeDto.AttributeId);
            return _mapper.Map<ProductAttribute>(updatedAttribute);
        }
    }
}
