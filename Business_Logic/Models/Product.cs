using Application_Layer.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Application_Layer;
public partial class Product
{
    public int ProductId { get; set; }

    public int CategoryId { get; set; }

    public string ProductSku { get; set; } = null!;

    public string ProductName { get; set; } = null!;

    public string? ProductDescription { get; set; }
    public string? Brand { get; set; }

    public decimal SalePrice { get; set; }

    public decimal? CostPrice { get; set; }

    public int? StockQuantity { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? CreatedDate { get; set; }

    public DateTime? ModifiedDate { get; set; }

    public virtual Category Category { get; set; } = null!;

    public virtual ICollection<CreateProductAttributeValueDto> ProductAttributes { get; set; } = new List<CreateProductAttributeValueDto>();
}


