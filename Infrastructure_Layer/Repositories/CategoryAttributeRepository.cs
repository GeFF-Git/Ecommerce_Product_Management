using Domain_Layer.Interfaces;
using Infrastructure_Layer.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure_Layer.Repositories
{
    public class CategoryAttributeRepository : GenericRepository<CategoryAttribute>, ICategoryAttributeRepository
    {
        public CategoryAttributeRepository(ProductDbContext context) : base(context)
        {
        }
    }
}
