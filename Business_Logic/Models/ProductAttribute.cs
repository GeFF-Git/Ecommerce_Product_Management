using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Application_Layer;
public partial class ProductAttribute
{
    //[Key]
    //[Column("ProductAttributeID")]
    public long ProductAttributeId { get; set; }

    //[Column("ProductID")]
    public int ProductId { get; set; }

    //[Column("AttributeID")]
    public int AttributeId { get; set; }

    [StringLength(200)]
    public string? AttributeValue { get; set; }

    public DateTime? CreatedDate { get; set; }

    public DateTime? ModifiedDate { get; set; }

    public virtual CategoryAttribute Attribute { get; set; } = null!;

    public virtual Product Product { get; set; } = null!;
}
