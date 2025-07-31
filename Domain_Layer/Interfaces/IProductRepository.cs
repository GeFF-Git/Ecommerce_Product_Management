using Infrastructure_Layer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain_Layer.Interfaces
{
    public interface IProductRepository : IGenericRepository<Product>
    {
        Task<Product?> GetProductWithDetailsAsync(int productId);
        Task<IEnumerable<Product>> GetProductsByCategoryAsync(int categoryId);

        IEnumerable<Product> GetProductsByCategoryAsQueryable(int categoryId);
        Task<Product?> GetProductWithAttributesForUpdateAsync(int productId);
        Task<IEnumerable<Product>> GetAllWithDetailsAsync();
    }
}
