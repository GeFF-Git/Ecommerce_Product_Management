using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure_Layer;

[Index("DataTypeName", Name = "UQ__Attribut__88554331F74B4635", IsUnique = true)]
public partial class AttributeDataType
{
    [Key]
    [Column("DataTypeID")]
    public int DataTypeId { get; set; }

    [StringLength(50)]
    public string DataTypeName { get; set; } = null!;

    public bool? IsActive { get; set; }

    public DateTime? CreatedDate { get; set; }

    [InverseProperty("DataType")]
    public virtual ICollection<CategoryAttribute> CategoryAttributes { get; set; } = new List<CategoryAttribute>();
}
