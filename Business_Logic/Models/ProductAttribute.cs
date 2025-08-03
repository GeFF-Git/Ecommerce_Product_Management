using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Application_Layer;
public partial class ProductAttribute
{
    public long ProductAttributeId { get; set; }
    public int ProductId { get; set; }
    public int AttributeId { get; set; }
    public string? AttributeValue { get; set; }

    public DateTime? CreatedDate { get; set; }

    public DateTime? ModifiedDate { get; set; }

    public virtual CategoryAttribute Attribute { get; set; } = null!;

    public virtual Product Product { get; set; } = null!;
}
