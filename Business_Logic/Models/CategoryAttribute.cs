using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Application_Layer;
public partial class CategoryAttribute
{
    public int AttributeId { get; set; }

    public int CategoryId { get; set; }

    [StringLength(100)]
    public string AttributeName { get; set; } = null!;

    [StringLength(100)]
    public string AttributeDisplayName { get; set; } = null!;

    public int DataTypeId { get; set; }

    [StringLength(500)]
    public string? DefaultValue { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? CreatedDate { get; set; }

    public DateTime? ModifiedDate { get; set; }

    public virtual Category Category { get; set; } = null!;

    public virtual AttributeDataType DataType { get; set; } = null!;

    public virtual ICollection<ProductAttribute> ProductAttributes { get; set; } = new List<ProductAttribute>();
}
