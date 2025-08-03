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
            CreateMap<Infrastructure_Layer.Category, CategoryDto>()
                .ForMember(cat => cat.Attributes, opt => opt.MapFrom(src => src.CategoryAttributes));
            CreateMap<CreateCategoryDto, Infrastructure_Layer.Category>();
            CreateMap<UpdateCategoryDto, Infrastructure_Layer.Category>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            // --- Category Attribute Mappings ---
            CreateMap<Infrastructure_Layer.CategoryAttribute, CategoryAttributeDto>();
            CreateMap<CreateCategoryAttributeDto, Infrastructure_Layer.CategoryAttribute>();
            CreateMap<UpdateCategoryAttributeDto, Infrastructure_Layer.CategoryAttribute>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            // --- Product Mappings ---
            CreateMap<Infrastructure_Layer.Product, ProductDto>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.CategoryName))
                .ForMember(dest => dest.Attributes, opt => opt.MapFrom(src => src.ProductAttributes));
            CreateMap<CreateProductDto, Infrastructure_Layer.Product>();
            CreateMap<UpdateProductDto, Infrastructure_Layer.Product>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            // --- Product Attribute Mappings ---
            CreateMap<Infrastructure_Layer.ProductAttribute, ProductAttributeValueDto>()
                .ForMember(dest => dest.AttributeName, opt => opt.MapFrom(src => src.Attribute.AttributeName))
                .ForMember(dest => dest.AttributeDisplayName, opt => opt.MapFrom(src => src.Attribute.AttributeDisplayName))
                .ForMember(dest => dest.Value, opt => opt.MapFrom(src => src.AttributeValue));
            CreateMap<CreateProductAttributeValueDto, Infrastructure_Layer.ProductAttribute>()
                .ForMember(dest => dest.AttributeValue, opt => opt.MapFrom(src => src.Value));
            CreateMap<UpdateProductAttributeValueDto, Infrastructure_Layer.ProductAttribute>()
                .ForMember(dest => dest.AttributeValue, opt => opt.MapFrom(src => src.Value))
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            // --- Domain Model Mappings ---
            CreateMap<Infrastructure_Layer.CategoryAttribute, CategoryAttribute>().ReverseMap();
            CreateMap<Infrastructure_Layer.ProductAttribute, ProductAttribute>().ReverseMap();
            CreateMap<Infrastructure_Layer.AttributeDataType, AttributeDataType>().ReverseMap();
        }
    }
}
