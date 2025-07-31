using Domain_Layer.Interfaces;
using Infrastructure_Layer.Data;
using System.ComponentModel;

namespace Infrastructure_Layer.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ProductDbContext _context;
        public ICategoryRepository Categories { get; private set; }
        public IProductRepository Products { get; private set; }
        public ICategoryAttributeRepository CategoryAttributes { get; private set; }

        public UnitOfWork(ProductDbContext context)
        {
            _context = context;
            Categories = new CategoryRepository(_context);
            Products = new ProductRepository(_context);
            CategoryAttributes = new CategoryAttributeRepository(_context);
        }

        public async Task<int> CompleteAsync() => await _context.SaveChangesAsync();
        public void Dispose() => _context.Dispose();
    }
}
