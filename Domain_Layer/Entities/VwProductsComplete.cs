using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure_Layer;

[Keyless]
public partial class VwProductsComplete
{
    [Column("ProductID")]
    public int ProductId { get; set; }

    [Column("ProductSKU")]
    [StringLength(50)]
    public string ProductSku { get; set; } = null!;

    [StringLength(200)]
    public string ProductName { get; set; } = null!;

    [StringLength(2000)]
    public string? ProductDescription { get; set; }

    [StringLength(100)]
    public string? Brand { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal SalePrice { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? CostPrice { get; set; }

    public int? StockQuantity { get; set; }

    [StringLength(100)]
    public string CategoryName { get; set; } = null!;

    [StringLength(100)]
    public string? AttributeName { get; set; }

    [StringLength(100)]
    public string? AttributeDisplayName { get; set; }

    [StringLength(50)]
    public string? DataTypeName { get; set; }

    [StringLength(200)]
    public string? AttributeValue { get; set; }

    public bool? ProductActive { get; set; }

    public DateTime? CreatedDate { get; set; }

    public DateTime? ModifiedDate { get; set; }
}
