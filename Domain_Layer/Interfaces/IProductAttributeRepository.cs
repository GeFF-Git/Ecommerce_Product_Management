using Infrastructure_Layer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain_Layer.Interfaces
{
    public interface IProductAttributeRepository : IGenericRepository<ProductAttribute>
    {
        Task<ProductAttribute?> FindByProductAndAttributeIdAsync(int productId, int attributeId);
    }
}
