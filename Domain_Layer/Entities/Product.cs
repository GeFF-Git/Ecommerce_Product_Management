using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure_Layer;

[Index("IsActive", "CreatedDate", Name = "IX_Products_Active", IsDescending = new[] { false, true })]
[Index("Brand", "IsActive", Name = "IX_Products_Brand")]
[Index("CategoryId", "IsActive", Name = "IX_Products_Category")]
[Index("CreatedDate", Name = "IX_Products_CreatedDate")]
[Index("SalePrice", "IsActive", Name = "IX_Products_Price")]
[Index("ProductSku", Name = "IX_Products_SKU")]
[Index("StockQuantity", "IsActive", Name = "IX_Products_Stock")]
[Index("ProductSku", Name = "UQ__Products__A34E50D0EFA41BFD", IsUnique = true)]
public partial class  Product
{
    [Key]
    [Column("ProductID")]
    public int ProductId { get; set; }

    [Column("CategoryID")]
    public int CategoryId { get; set; }

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

    public bool? IsActive { get; set; }

    public DateTime? CreatedDate { get; set; }

    public DateTime? ModifiedDate { get; set; }

    [ForeignKey("CategoryId")]
    [InverseProperty("Products")]
    public virtual Category Category { get; set; } = new Category();

    [InverseProperty("Product")]
    public virtual ICollection<ProductAttribute> ProductAttributes { get; set; } = new List<ProductAttribute>();
}
