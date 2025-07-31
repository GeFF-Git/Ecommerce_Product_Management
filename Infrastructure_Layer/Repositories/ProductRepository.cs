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
    public class ProductRepository : GenericRepository<Product>, IProductRepository
    {
        public ProductRepository(ProductDbContext context) : base(context) { }

        public async Task<Product?> GetProductWithDetailsAsync(int productId)
        {
            return await _dbSet
                .Include(p => p.Category)
                //.Skip((pageNumber - 1) * pageSize).Take(pageSize)
                .Include(p => p.ProductAttributes)
                    .ThenInclude(pa => pa.Attribute)
                    .AsNoTracking()
                .FirstOrDefaultAsync(p => p.ProductId == productId);
        }

        public async Task<IEnumerable<Product>> GetProductsByCategoryAsync(int categoryId)
        {
            return await _dbSet
                .Where(p => p.CategoryId == categoryId)
                .AsNoTracking()
                .ToListAsync();
        }

        public IEnumerable<Product> GetProductsByCategoryAsQueryable(int categoryId)
        {
            return _dbSet
                .Where(p => p.CategoryId == categoryId).
                AsNoTracking()
                .AsQueryable();
        }

        public async Task<Product?> GetProductWithAttributesForUpdateAsync(int productId)
        {
            // This method fetches the product AND its attributes for tracking.
            // Crucially, it does NOT use AsNoTracking(), so EF Core will track
            // any changes made to the returned entity and its collections.
            return await _dbSet
                .Include(p => p.ProductAttributes)
                .FirstOrDefaultAsync(p => p.ProductId == productId);
        }

        public async Task<IEnumerable<Product>> GetAllWithDetailsAsync()
        {
            return await _dbSet
                .Include(p => p.Category)
                .Include(p => p.ProductAttributes)
                    .ThenInclude(pa => pa.Attribute)
                .AsNoTracking()
                .ToListAsync();
        }
    }
}
