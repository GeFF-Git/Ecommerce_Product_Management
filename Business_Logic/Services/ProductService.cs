using Application_Layer.Interfaces;
using Application_Layer.Models;
using AutoMapper;
using Domain_Layer.Interfaces;
namespace Application_Layer.Services
{
    public class ProductService : IProductService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IConfigurationProvider _configurationProvider;
        public ProductService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _configurationProvider = _mapper.ConfigurationProvider;
        }

        public async Task<IEnumerable<ProductDto>> GetAllProductsAsync() 
        {
            var product = await _unitOfWork.Products.GetAllWithDetailsAsync();
            return _mapper.Map<IEnumerable<ProductDto>>(product); 
        }

        public async Task<ProductDto?> GetProductByIdAsync(int id) => _mapper.Map<ProductDto>(await _unitOfWork.Products.GetProductWithDetailsAsync(id));

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
            await _unitOfWork.Products.AddAsync(product);
            await _unitOfWork.CompleteAsync();
            var createdProduct = await _unitOfWork.Products.GetProductWithDetailsAsync(product.ProductId);
            return _mapper.Map<ProductDto>(createdProduct);
        }

        public async Task<bool> UpdateProductAsync(int id, UpdateProductDto productDto)
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

        public async Task<bool> EnableProductAsync(int id)
        {
            var product = await _unitOfWork.Products.GetByIdAsync(id);
            if (product == null) return false;

            product.IsActive = true;
            product.ModifiedDate = DateTime.UtcNow;

            _unitOfWork.Products.Update(product);
            await _unitOfWork.CompleteAsync();
            return true;
        }

        public async Task<ProductAttributeValueDto> AddOrUpdateAttributeForProductAsync(int productId, CreateProductAttributeValueDto attributeDto)
        {
            var product = await _unitOfWork.Products.GetProductWithAttributesForUpdateAsync(productId);
            if (product == null)
            {
                throw new InvalidOperationException("Product not found.");
            }

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
                // Add new attribute value to the TRACKED collection
                var newAttributeValue = _mapper.Map<Infrastructure_Layer.ProductAttribute>(attributeDto);
                product.ProductAttributes.Add(newAttributeValue);
            }

            await _unitOfWork.CompleteAsync();
            var reloadedProduct = await _unitOfWork.Products.GetProductWithDetailsAsync(productId);
            var updatedAttribute = reloadedProduct.ProductAttributes.First(pa => pa.AttributeId == attributeDto.AttributeId);
            return _mapper.Map<ProductAttributeValueDto>(updatedAttribute);
        }

        public async Task<bool> UpdateProductAttributeValueAsync(int productId, int attributeId, UpdateProductAttributeValueDto attributeDto)
        {
            var attributeValue = await _unitOfWork.ProductAttributes.FindByProductAndAttributeIdAsync(productId, attributeId);
            if (attributeValue == null) return false;

            _mapper.Map(attributeDto, attributeValue);
            attributeValue.ModifiedDate = DateTime.UtcNow;
            _unitOfWork.ProductAttributes.Update(attributeValue);
            await _unitOfWork.CompleteAsync();
            return true;
        }

        public async Task<bool> DeleteProductAttributeValueAsync(int productId, int attributeId)
        {
            var attributeValue = await _unitOfWork.ProductAttributes.FindByProductAndAttributeIdAsync(productId, attributeId);
            if (attributeValue == null) return false;

            // This is a hard delete, as removing a value is usually permanent.
            _unitOfWork.ProductAttributes.Delete(attributeValue);
            await _unitOfWork.CompleteAsync();
            return true;
        }
    }
}
