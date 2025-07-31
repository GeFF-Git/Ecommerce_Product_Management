using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure_Layer;

[Index("CategoryId", "IsActive", Name = "IX_CategoryAttributes_Category")]
[Index("CreatedDate", Name = "IX_CategoryAttributes_CreatedDate")]
[Index("CategoryId", "AttributeName", Name = "UK_CategoryAttributes_Name", IsUnique = true)]
public partial class CategoryAttribute
{
    [Key]
    [Column("AttributeID")]
    public int AttributeId { get; set; }

    [Column("CategoryID")]
    public int CategoryId { get; set; }

    [StringLength(100)]
    public string AttributeName { get; set; } = null!;

    [StringLength(100)]
    public string AttributeDisplayName { get; set; } = null!;

    [Column("DataTypeID")]
    public int DataTypeId { get; set; }

    [StringLength(500)]
    public string? DefaultValue { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? CreatedDate { get; set; }

    public DateTime? ModifiedDate { get; set; }

    [ForeignKey("CategoryId")]
    [InverseProperty("CategoryAttributes")]
    public virtual Category Category { get; set; } = null!;

    [ForeignKey("DataTypeId")]
    [InverseProperty("CategoryAttributes")]
    public virtual AttributeDataType DataType { get; set; } = null!;

    [InverseProperty("Attribute")]
    public virtual ICollection<ProductAttribute> ProductAttributes { get; set; } = new List<ProductAttribute>();
}
