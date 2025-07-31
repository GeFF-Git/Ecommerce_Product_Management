using Domain_Layer.Interfaces;
using Infrastructure_Layer.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure_Layer.Repositories
{
    public class ProductAttributeRepository : GenericRepository<ProductAttribute>, IProductAttributeRepository
    {
        public ProductAttributeRepository(ProductDbContext context) : base(context)
        {
        }

        public async Task<ProductAttribute?> FindByProductAndAttributeIdAsync(int productId, int attributeId)
        {
            return await _dbSet.FirstOrDefaultAsync(pa => pa.ProductId == productId && pa.AttributeId == attributeId);
        }
    }
}
