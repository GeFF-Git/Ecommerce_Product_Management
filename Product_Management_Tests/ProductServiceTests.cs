using Castle.Core.Logging;
using Moq;
using AutoMapper;

namespace Product_Management_Tests
{
    [TestFixture]
    public class ProductServiceTests
    {
        private Mock<IUnitOfWork> _mockUnitOfWork;
        private Mock<IProductRepository> _mockProductRepo;
        private IMapper _mapper;
        private ILoggerFactory _loggerFactory;
        [SetUp]
        public void Setup()
        {
            _mockProductRepo = new Mock<IProductRepository>();
            _mockUnitOfWork = new Mock<IUnitOfWork>();
            _mockUnitOfWork.Setup(uow => uow.Products).Returns(_mockProductRepo.Object);
            var configuration = new AutoMapper.MapperConfiguration();
            _mapper = configuration.CreateMapper();
        }

        [Test]
        public async Task GetAllProductsAsync_WhenProductsExist_ReturnsProductDtos()
        {
            // Arrange
            var products = new List<Infrastructure_Layer.Product>
            {
                new Infrastructure_Layer.Product { ProductId = 1, ProductName = "Laptop", Category = new Infrastructure_Layer.Category { CategoryName = "Electronics" } },
                new Infrastructure_Layer.Product { ProductId = 2, ProductName = "Mouse", Category = new Infrastructure_Layer.Category { CategoryName = "Electronics" } }
            };
            _mockProductRepo.Setup(repo => repo.GetAllWithDetailsAsync()).ReturnsAsync(products);
            _mockProductRepo.Setup(repo => repo.GetProductsByCategoryAsQueryable(It.IsAny<int>()))
                .Returns(products.AsEnumerable());   
            var service = new ProductService(_mockUnitOfWork.Object, _mapper);

            // Act
            var result = await service.GetAllProductsAsync();

            // Assert
            Assert.That(result.Count(), Is.EqualTo(2));
            Assert.That(result.First().CategoryName, Is.EqualTo("Electronics"));
        }

        [Test]
        public async Task CreateProductAsync_WithValidDto_ReturnsMappedDto()
        {
            // Arrange
            var createDto = new CreateProductDto { ProductName = "New Keyboard", CategoryId = 1 };

            // This setup captures the product after it's added and assigns it an ID,
            // simulating what the database would do.
            _mockProductRepo.Setup(repo => repo.AddAsync(It.IsAny<Infrastructure_Layer.Product>()))
                .Callback<Infrastructure_Layer.Product>(p => p.ProductId = 100); // Simulate DB generating an ID

            // Setup the reload to return a fully detailed object
            _mockProductRepo.Setup(repo => repo.GetProductWithDetailsAsync(100))
                .ReturnsAsync(new Infrastructure_Layer.Product { ProductId = 100, ProductName = "New Keyboard", Category = new Infrastructure_Layer.Category { CategoryName = "Peripherals" } });

            var service = new ProductService(_mockUnitOfWork.Object, _mapper);

            // Act
            var result = await service.CreateProductAsync(createDto);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.ProductId, Is.EqualTo(100));
            Assert.That(result.ProductName, Is.EqualTo("New Keyboard"));
            Assert.That(result.CategoryName, Is.EqualTo("Peripherals"));
            _mockUnitOfWork.Verify(uow => uow.CompleteAsync(), Times.Once);
        }
    }
}