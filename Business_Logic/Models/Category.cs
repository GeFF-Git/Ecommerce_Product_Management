using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Application_Layer;
public partial class Category
{
    public int CategoryId { get; set; }

    [StringLength(100)]
    public string CategoryName { get; set; } = null!;

    [StringLength(500)]
    public string? CategoryDescription { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? CreatedDate { get; set; }

    public DateTime? ModifiedDate { get; set; }

    public virtual ICollection<CategoryAttribute> CategoryAttributes { get; set; } = new List<CategoryAttribute>();

    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
}

// DTO for defining a new attribute when creating a category
//public class CreateCategoryAttributeDto
//{
//    public string AttributeName { get; set; }
//    public string AttributeDisplayName { get; set; }
//    public int DataTypeId { get; set; }
//}

//public class CreateCategoryDto
//{
//    public string CategoryName { get; set; }
//    public string? CategoryDescription { get; set; }
//    // This list can be provided to create attributes at the same time.
//    // If it's empty or null, only the category is created.
//    public List<CreateCategoryAttributeDto>? Attributes { get; set; }
//}
