using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain_Layer.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        ICategoryRepository Categories { get; }
        IProductRepository Products { get; }
        ICategoryAttributeRepository CategoryAttributes { get; }

        // Commits all changes made within a transaction to the database.
        Task<int> CompleteAsync();
    }
}
