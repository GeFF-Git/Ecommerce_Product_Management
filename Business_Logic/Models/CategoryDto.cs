using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application_Layer.Models
{
    public class CreateCategoryAttributeDto
    {
        public string AttributeName { get; set; }
        public string AttributeDisplayName { get; set; }
        public int DataTypeId { get; set; }
    }

    public class CategoryAttributeDto
    {
        public int AttributeId { get; set; }
        public string AttributeName { get; set; }
        public string AttributeDisplayName { get; set; }
        public int DataTypeId { get; set; }
        public bool IsActive { get; set; }
    }

    public class CategoryDto
    {
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
        public string? CategoryDescription { get; set; }
        public bool IsActive { get; set; }
        public List<CategoryAttributeDto> Attributes { get; set; } = new();
    }

    public class CreateCategoryDto
    {
        public string CategoryName { get; set; }
        public string? CategoryDescription { get; set; }
        public List<CreateCategoryAttributeDto>? Attributes { get; set; }
    }

    public class UpdateCategoryDto
    {
        public string CategoryName { get; set; }
        public string? CategoryDescription { get; set; }
    }

    public class UpdateCategoryAttributeDto
    {
        public string AttributeName { get; set; }
        public string AttributeDisplayName { get; set; }
    }
}
