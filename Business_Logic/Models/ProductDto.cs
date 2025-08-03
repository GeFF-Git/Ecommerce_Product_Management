using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application_Layer.Models
{
    /// <summary>
    /// DTO for reading/displaying a fully detailed Product.
    /// This is what you would send TO the client in a GET request.
    /// </summary>
    public class ProductDto
    {
        public int ProductId { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
        public string ProductSku { get; set; }
        public string ProductName { get; set; }
        public string Brand { get; set; }
        public string? ProductDescription { get; set; }
        public decimal SalePrice { get; set; }
        public int StockQuantity { get; set; }
        public bool? IsActive { get; set; }
        public List<ProductAttributeValueDto> Attributes { get; set; } = new();
    }

    /// <summary>
    /// DTO for displaying a Product's attribute and its assigned value.
    /// </summary>
    public class ProductAttributeValueDto
    {
        public string AttributeName { get; set; }
        public string AttributeDisplayName { get; set; }
        public string? Value { get; set; }
    }

    /// <summary>
    /// DTO for creating a new Product.
    /// This is what you would receive FROM the client in a POST request.
    /// It can optionally include attribute values to be set at creation time.
    /// </summary>
    public class CreateProductDto
    {
        public int CategoryId { get; set; }
        public string ProductSku { get; set; }
        public string ProductName { get; set; }
        public string Brand { get; set; }
        public string? ProductDescription { get; set; }
        public decimal SalePrice { get; set; }
        public int StockQuantity { get; set; }
        public List<CreateProductAttributeValueDto>? Attributes { get; set; }
    }

    /// <summary>
    /// DTO for providing a value for a specific attribute when creating a product
    /// or adding/updating an attribute value later.
    /// </summary>
    public class CreateProductAttributeValueDto
    {
        public int AttributeId { get; set; }
        public string? Value { get; set; }
    }

    public class UpdateProductDto
    {
        public string ProductSku { get; set; }
        public string ProductName { get; set; }
        public string? ProductDescription { get; set; }
        public decimal SalePrice { get; set; }
        public int StockQuantity { get; set; }
    }
}
