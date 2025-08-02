using Moq;

namespace Product_Management_Tests;

[TestFixture]
public class CategoryServiceTests
{
    private Mock<IUnitOfWork> _mockUnitOfWork;
    private Mock<ICategoryRepository> _mockCategoryRepo;
    private Mock<ICategoryAttributeRepository> _mockCategoryAttributeRepo;

    [SetUp]
    public void Setup()
    {
        // Arrange: Setup mock repositories and AutoMapper before each test.
        _mockCategoryRepo = new Mock<ICategoryRepository>();
        _mockCategoryAttributeRepo = new Mock<ICategoryAttributeRepository>();
        _mockUnitOfWork = new Mock<IUnitOfWork>();

        // Configure the Unit of Work mock to return the mocked repositories
        _mockUnitOfWork.Setup(uow => uow.Categories).Returns(_mockCategoryRepo.Object);
        _mockUnitOfWork.Setup(uow => uow.CategoryAttributes).Returns(_mockCategoryAttributeRepo.Object);
    }

    [Test]
    public async Task GetAllCategoriesAsync_WhenCategoriesExist_ReturnsCategoryDtos()
    {
        // Arrange
        var categories = new List<Infrastructure_Layer.Category>
            {
                new Infrastructure_Layer.Category { CategoryId = 1, CategoryName = "Dresses" },
                new Infrastructure_Layer.Category { CategoryId = 2, CategoryName = "Shoes" }
            };
        _mockCategoryRepo.Setup(repo => repo.GetAllWithAttributesAsync()).ReturnsAsync(categories);
        var service = new CategoryService(_mockUnitOfWork.Object, _mapper);

        // Act
        var result = await service.GetAllCategoriesAsync();

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.Count(), Is.EqualTo(2));
        Assert.That(result.First().CategoryName, Is.EqualTo("Dresses"));
    }

    [Test]
    public async Task GetCategoryByIdAsync_WhenCategoryDoesNotExist_ReturnsNull()
    {
        // Arrange
        _mockCategoryRepo.Setup(repo => repo.GetCategoryWithAttributesAsync(It.IsAny<int>())).ReturnsAsync((Infrastructure_Layer.Category)null);
        var service = new CategoryService(_mockUnitOfWork.Object, _mapper);

        // Act
        var result = await service.GetCategoryByIdAsync(99);

        // Assert
        Assert.That(result, Is.Null);
    }

    [Test]
    public async Task CreateCategoryAsync_WithValidDto_CallsAddAndComplete()
    {
        // Arrange
        var createDto = new CreateCategoryDto { CategoryName = "Electronics" };
        var service = new CategoryService(_mockUnitOfWork.Object, _mapper);

        // Act
        await service.CreateCategoryAsync(createDto);

        // Assert
        _mockCategoryRepo.Verify(repo => repo.AddAsync(It.IsAny<Infrastructure_Layer.Category>()), Times.Once);
        _mockUnitOfWork.Verify(uow => uow.CompleteAsync(), Times.Once);
    }

    [Test]
    public async Task UpdateCategoryAsync_WhenCategoryNotFound_ReturnsFalse()
    {
        // Arrange
        _mockCategoryRepo.Setup(repo => repo.GetByIdAsync(It.IsAny<int>())).ReturnsAsync((Infrastructure_Layer.Category)null);
        var service = new CategoryService(_mockUnitOfWork.Object, _mapper);
        var updateDto = new UpdateCategoryDto { CategoryName = "Updated Name" };

        // Act
        var result = await service.UpdateCategoryAsync(99, updateDto);

        // Assert
        Assert.That(result, Is.False);
    }

    [Test]
    public async Task DeleteCategoryAttributeAsync_WhenAttributeExists_SoftDeletesAndReturnsTrue()
    {
        // Arrange
        var attribute = new Infrastructure_Layer.CategoryAttribute { AttributeId = 1, IsActive = true };
        _mockCategoryAttributeRepo.Setup(repo => repo.GetByIdAsync(1)).ReturnsAsync(attribute);
        var service = new CategoryService(_mockUnitOfWork.Object, _mapper);

        // Act
        var result = await service.DeleteCategoryAttributeAsync(1);

        // Assert
        Assert.That(result, Is.True);
        Assert.That(attribute.IsActive, Is.False); // Verify it was soft deleted
        _mockUnitOfWork.Verify(uow => uow.CompleteAsync(), Times.Once);
    }
}
