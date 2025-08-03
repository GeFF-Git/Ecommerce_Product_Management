using AutoMapper;
using Microsoft.Extensions.Logging.Abstractions;
using Moq;
using Microsoft.Extensions.Logging;
namespace Product_Management_Tests
{
    [TestFixture]
    public class ProductServiceTests
    {
        private Mock<IUnitOfWork> _mockUnitOfWork;
        private Mock<IProductRepository> _mockProductRepo;
        private Mock<ICategoryRepository> _mockCategoryRepo;
        private Mock<IProductAttributeRepository> _mockProductAttributeRepo;
        private IMapper _mapper;
        private ILoggerFactory _logger;

        [SetUp]
        public void Setup()
        {
            _mockProductRepo = new Mock<IProductRepository>();
            _mockCategoryRepo = new Mock<ICategoryRepository>();
            _mockProductAttributeRepo = new Mock<IProductAttributeRepository>();
            _mockUnitOfWork = new Mock<IUnitOfWork>();
            _mockUnitOfWork.Setup(uow => uow.Products).Returns(_mockProductRepo.Object);
            _mockUnitOfWork.Setup(uow => uow.Categories).Returns(_mockCategoryRepo.Object);
            _mockUnitOfWork.Setup(uow => uow.ProductAttributes).Returns(_mockProductAttributeRepo.Object);

            // ADD YOUR MAPPING PROFILE HERE:
            _logger = new NullLoggerFactory();
            var configuration = new MapperConfiguration(cfg => cfg.AddProfile<Application_Layer.Mappings.MappingProfile>(), _logger);
            _mapper = configuration.CreateMapper();
        }

        [TearDown]
        public void TearDown()
        {
            // Dispose of the logger factory to satisfy disposal requirements
            _logger?.Dispose();
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
                .Returns(products.AsQueryable());
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
            var createDto = new CreateProductDto
            {
                ProductName = "New Keyboard",
                ProductSku = "KEY001",
                SalePrice = 79.99m,
                StockQuantity = 25,
                CategoryId = 1,
                Brand = "TechBrand"
            };

            var category = new Infrastructure_Layer.Category { CategoryId = 1, CategoryName = "Peripherals" };
            var createdProduct = new Infrastructure_Layer.Product
            {
                ProductId = 100,
                ProductName = "New Keyboard",
                ProductSku = "KEY001",
                SalePrice = 79.99m,
                StockQuantity = 25,
                CategoryId = 1,
                Brand = "TechBrand",
                Category = category,
                ProductAttributes = new List<Infrastructure_Layer.ProductAttribute>()
            };

            // Setup category exists check
            _mockCategoryRepo.Setup(repo => repo.GetByIdAsync(1)).ReturnsAsync(category);

            // Setup product creation
            _mockProductRepo.Setup(repo => repo.AddAsync(It.IsAny<Infrastructure_Layer.Product>()))
                .Callback<Infrastructure_Layer.Product>(p => p.ProductId = 100);

            // Setup the reload to return a fully detailed object
            _mockProductRepo.Setup(repo => repo.GetProductWithDetailsAsync(100)).ReturnsAsync(createdProduct);

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

        [Test]
        public async Task GetProductByIdAsync_WhenProductExists_ReturnsProductDto()
        {
            // Arrange
            var product = new Infrastructure_Layer.Product
            {
                ProductId = 1,
                ProductName = "Laptop",
                ProductSku = "LAP001",
                SalePrice = 999.99m,
                StockQuantity = 10,
                Category = new Infrastructure_Layer.Category { CategoryName = "Electronics" },
                ProductAttributes = new List<Infrastructure_Layer.ProductAttribute>()
            };

            _mockProductRepo.Setup(repo => repo.GetProductWithDetailsAsync(1)).ReturnsAsync(product);
            var service = new ProductService(_mockUnitOfWork.Object, _mapper);

            // Act
            var result = await service.GetProductByIdAsync(1);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.ProductId, Is.EqualTo(1));
            Assert.That(result.ProductName, Is.EqualTo("Laptop"));
            Assert.That(result.CategoryName, Is.EqualTo("Electronics"));
        }

        [Test]
        public async Task GetProductByIdAsync_WhenProductDoesNotExist_ReturnsNull()
        {
            // Arrange
            _mockProductRepo.Setup(repo => repo.GetProductWithDetailsAsync(999)).ReturnsAsync((Infrastructure_Layer.Product)null);
            var service = new ProductService(_mockUnitOfWork.Object, _mapper);

            // Act
            var result = await service.GetProductByIdAsync(999);

            // Assert
            Assert.That(result, Is.Null);
        }

        [Test]
        public async Task UpdateProductAsync_WhenProductExists_ReturnsTrue()
        {
            // Arrange
            var product = new Infrastructure_Layer.Product { ProductId = 1, ProductName = "Old Name" };
            var updateDto = new UpdateProductDto { ProductName = "Updated Name", SalePrice = 199.99m, StockQuantity = 15 };

            _mockProductRepo.Setup(repo => repo.GetByIdAsync(1)).ReturnsAsync(product);
            var service = new ProductService(_mockUnitOfWork.Object, _mapper);

            // Act
            var result = await service.UpdateProductAsync(1, updateDto);

            // Assert
            Assert.That(result, Is.True);
            _mockProductRepo.Verify(repo => repo.Update(It.IsAny<Infrastructure_Layer.Product>()), Times.Once);
            _mockUnitOfWork.Verify(uow => uow.CompleteAsync(), Times.Once);
        }

        [Test]
        public async Task UpdateProductAsync_WhenProductDoesNotExist_ReturnsFalse()
        {
            // Arrange
            var updateDto = new UpdateProductDto { ProductName = "Updated Name" };
            _mockProductRepo.Setup(repo => repo.GetByIdAsync(999)).ReturnsAsync((Infrastructure_Layer.Product)null);
            var service = new ProductService(_mockUnitOfWork.Object, _mapper);

            // Act
            var result = await service.UpdateProductAsync(999, updateDto);

            // Assert
            Assert.That(result, Is.False);
        }

        [Test]
        public async Task DeleteProductAsync_WhenProductExists_SoftDeletesAndReturnsTrue()
        {
            // Arrange
            var product = new Infrastructure_Layer.Product { ProductId = 1, IsActive = true };
            _mockProductRepo.Setup(repo => repo.GetByIdAsync(1)).ReturnsAsync(product);
            var service = new ProductService(_mockUnitOfWork.Object, _mapper);

            // Act
            var result = await service.DeleteProductAsync(1);

            // Assert
            Assert.That(result, Is.True);
            Assert.That(product.IsActive, Is.False);
            _mockUnitOfWork.Verify(uow => uow.CompleteAsync(), Times.Once);
        }

        [Test]
        public async Task DeleteProductAsync_WhenProductDoesNotExist_ReturnsFalse()
        {
            // Arrange
            _mockProductRepo.Setup(repo => repo.GetByIdAsync(999)).ReturnsAsync((Infrastructure_Layer.Product)null);
            var service = new ProductService(_mockUnitOfWork.Object, _mapper);

            // Act
            var result = await service.DeleteProductAsync(999);

            // Assert
            Assert.That(result, Is.False);
        }

        [Test]
        public async Task EnableProductAsync_WhenProductExists_EnablesAndReturnsTrue()
        {
            // Arrange
            var product = new Infrastructure_Layer.Product { ProductId = 1, IsActive = false };
            _mockProductRepo.Setup(repo => repo.GetByIdAsync(1)).ReturnsAsync(product);
            var service = new ProductService(_mockUnitOfWork.Object, _mapper);

            // Act
            var result = await service.EnableProductAsync(1);

            // Assert
            Assert.That(result, Is.True);
            Assert.That(product.IsActive, Is.True);
            _mockUnitOfWork.Verify(uow => uow.CompleteAsync(), Times.Once);
        }

        [Test]
        public async Task EnableProductAsync_WhenProductDoesNotExist_ReturnsFalse()
        {
            // Arrange
            _mockProductRepo.Setup(repo => repo.GetByIdAsync(999)).ReturnsAsync((Infrastructure_Layer.Product)null);
            var service = new ProductService(_mockUnitOfWork.Object, _mapper);

            // Act
            var result = await service.EnableProductAsync(999);

            // Assert
            Assert.That(result, Is.False);
        }

        [Test]
        public async Task UpdateProductAttributeValueAsync_WhenAttributeExists_ReturnsTrue()
        {
            // Arrange
            var attributeValue = new Infrastructure_Layer.ProductAttribute { ProductId = 1, AttributeId = 1, AttributeValue = "Old Value" };
            var updateDto = new UpdateProductAttributeValueDto { Value = "New Value" };

            _mockProductAttributeRepo.Setup(repo => repo.FindByProductAndAttributeIdAsync(1, 1)).ReturnsAsync(attributeValue);
            var service = new ProductService(_mockUnitOfWork.Object, _mapper);

            // Act
            var result = await service.UpdateProductAttributeValueAsync(1, 1, updateDto);

            // Assert
            Assert.That(result, Is.True);
            Assert.That(attributeValue.AttributeValue, Is.EqualTo("New Value"));
            _mockProductAttributeRepo.Verify(repo => repo.Update(It.IsAny<Infrastructure_Layer.ProductAttribute>()), Times.Once);
            _mockUnitOfWork.Verify(uow => uow.CompleteAsync(), Times.Once);
        }

        [Test]
        public async Task UpdateProductAttributeValueAsync_WhenAttributeDoesNotExist_ReturnsFalse()
        {
            // Arrange
            var updateDto = new UpdateProductAttributeValueDto { Value = "New Value" };
            _mockProductAttributeRepo.Setup(repo => repo.FindByProductAndAttributeIdAsync(1, 999)).ReturnsAsync((Infrastructure_Layer.ProductAttribute)null);
            var service = new ProductService(_mockUnitOfWork.Object, _mapper);

            // Act
            var result = await service.UpdateProductAttributeValueAsync(1, 999, updateDto);

            // Assert
            Assert.That(result, Is.False);
        }

        [Test]
        public async Task DeleteProductAttributeValueAsync_WhenAttributeExists_ReturnsTrue()
        {
            // Arrange
            var attributeValue = new Infrastructure_Layer.ProductAttribute { ProductId = 1, AttributeId = 1 };
            _mockProductAttributeRepo.Setup(repo => repo.FindByProductAndAttributeIdAsync(1, 1)).ReturnsAsync(attributeValue);
            var service = new ProductService(_mockUnitOfWork.Object, _mapper);

            // Act
            var result = await service.DeleteProductAttributeValueAsync(1, 1);

            // Assert
            Assert.That(result, Is.True);
            _mockProductAttributeRepo.Verify(repo => repo.Delete(attributeValue), Times.Once);
            _mockUnitOfWork.Verify(uow => uow.CompleteAsync(), Times.Once);
        }

        [Test]
        public async Task DeleteProductAttributeValueAsync_WhenAttributeDoesNotExist_ReturnsFalse()
        {
            // Arrange
            _mockProductAttributeRepo.Setup(repo => repo.FindByProductAndAttributeIdAsync(1, 999)).ReturnsAsync((Infrastructure_Layer.ProductAttribute)null);
            var service = new ProductService(_mockUnitOfWork.Object, _mapper);

            // Act
            var result = await service.DeleteProductAttributeValueAsync(1, 999);

            // Assert
            Assert.That(result, Is.False);
        }
    }
}
