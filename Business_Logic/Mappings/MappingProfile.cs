using Application_Layer.Models;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application_Layer.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // --- Category Mappings ---
            // Defines a two-way mapping between the Category entity and its DTO.
            CreateMap<Infrastructure_Layer.Category, Category>().ReverseMap();


            // --- Product Mappings ---
            // Defines a two-way mapping between the Product entity and its DTO.
            CreateMap<Infrastructure_Layer.Product, Product>().ReverseMap();


            // --- Attribute Mappings ---
            // These are typically one-way mappings for reading data, as attributes
            // are usually managed in the context of their parent (Category or Product).

            // Maps the CategoryAttribute entity to its DTO.
            CreateMap<Infrastructure_Layer.CategoryAttribute, CategoryAttribute>().ReverseMap();

            // Maps the ProductAttribute entity to its DTO.
            CreateMap<Infrastructure_Layer.ProductAttribute, ProductAttribute>().ReverseMap();

            CreateMap<Infrastructure_Layer.AttributeDataType, AttributeDataType>().ReverseMap();

            // For Reading: Maps the Category entity to its detailed DTO, including attributes.
            CreateMap<Infrastructure_Layer.Category, CategoryDto>()
                .ForMember(cat => cat.Attributes, opt => opt.MapFrom(src => src.CategoryAttributes));

            // For Writing: Maps the DTO for creating a new category to the Category entity.
            // AutoMapper will also map the nested list of CreateCategoryAttributeDto to CategoryAttribute entities.
            CreateMap<CreateCategoryDto, Infrastructure_Layer.Category>();

            // For Updating: Maps the DTO for updating a category to the Category entity.
            CreateMap<UpdateCategoryDto, Infrastructure_Layer.Category>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null)); ;

            // Maps CategoryDto to Category Entity 
            CreateMap<CategoryDto, Infrastructure_Layer.Category>();

            //Maps Entity Product to ProductDto
            CreateMap<Infrastructure_Layer.Product, ProductDto>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.CategoryName))
                .ForMember(dest => dest.Attributes, opt => opt.MapFrom(src => src.ProductAttributes));

            // --- Category Attribute Mappings ---

            // For Reading: Maps the CategoryAttribute entity to its DTO.
            CreateMap<Infrastructure_Layer.CategoryAttribute, CategoryAttributeDto>();

            // For Writing: Maps the DTO for creating a new attribute to the CategoryAttribute entity.
            CreateMap<CreateCategoryAttributeDto, Infrastructure_Layer.CategoryAttribute>();
                //.ForMember(dest => dest.AttributeDisplayName, opt => opt.MapFrom(src => src.AttributeDisplayName));

            // For Updating: Maps the DTO for updating an attribute to the CategoryAttribute entity.
            CreateMap<UpdateCategoryAttributeDto, Infrastructure_Layer.CategoryAttribute>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            //CreateMap<Product, ProductDto>().ReverseMap();
            CreateMap<Infrastructure_Layer.Product, ProductDto>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.CategoryName))
                .ForMember(dest => dest.Attributes, opt => opt.MapFrom(src => src.ProductAttributes)).ReverseMap();

            CreateMap<CreateProductDto, Infrastructure_Layer.Product>();

            CreateMap<UpdateProductDto, Infrastructure_Layer.Product>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            CreateMap<Infrastructure_Layer.ProductAttribute, ProductAttributeValueDto>()
                .ForMember(dest => dest.AttributeName, opt => opt.MapFrom(src => src.Attribute.AttributeDisplayName))
                .ForMember(dest => dest.Value, opt => opt.MapFrom(src => src.AttributeValue));

            CreateMap<CreateProductAttributeValueDto, Infrastructure_Layer.ProductAttribute>()
                .ForMember(dest => dest.AttributeValue, opt => opt.MapFrom(src => src.Value));

            CreateMap<Infrastructure_Layer.ProductAttribute, ProductAttributeValueDto>()
                .ForMember(dest => dest.AttributeName, opt => opt.MapFrom(src => src.Attribute.AttributeDisplayName))
                .ForMember(dest => dest.Value, opt => opt.MapFrom(src => src.AttributeValue));

            CreateMap<UpdateProductAttributeValueDto, Infrastructure_Layer.ProductAttribute>()
                .ForMember(dest => dest.AttributeValue, opt => opt.MapFrom(src => src.Value))
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
        }
    }
}
