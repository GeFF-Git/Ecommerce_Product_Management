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
    public class CategoryRepository : GenericRepository<Category>, ICategoryRepository
    {
        public CategoryRepository(ProductDbContext context) : base(context) { }

        public async Task<Category?> GetCategoryWithAttributesAsync(int categoryId)
        {
            return await _dbSet
                .Include(c => c.CategoryAttributes)
                .FirstOrDefaultAsync(c => c.CategoryId == categoryId);
        }

        public async Task<IEnumerable<Category>> GetAllWithAttributesAsync()
        {
            return await _dbSet
                .Include(c => c.CategoryAttributes)
                .AsNoTracking()
                .ToListAsync();
        }
    }
}
