using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure_Layer;

[Index("AttributeId", Name = "IX_ProductAttributes_Attribute")]
[Index("CreatedDate", Name = "IX_ProductAttributes_CreatedDate")]
[Index("ProductId", Name = "IX_ProductAttributes_Product")]
[Index("AttributeId", "AttributeValue", Name = "IX_ProductAttributes_Value")]
[Index("ProductId", "AttributeId", Name = "UK_ProductAttributes_Unique", IsUnique = true)]
public partial class ProductAttribute
{
    [Key]
    [Column("ProductAttributeID")]
    public long ProductAttributeId { get; set; }

    [Column("ProductID")]
    public int ProductId { get; set; }

    [Column("AttributeID")]
    public int AttributeId { get; set; }

    [StringLength(200)]
    public string? AttributeValue { get; set; }

    public DateTime? CreatedDate { get; set; }

    public DateTime? ModifiedDate { get; set; }

    [ForeignKey("AttributeId")]
    [InverseProperty("ProductAttributes")]
    public virtual CategoryAttribute Attribute { get; set; } = null!;

    [ForeignKey("ProductId")]
    [InverseProperty("ProductAttributes")]
    public virtual Product Product { get; set; } = null!;
}
