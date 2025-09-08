import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSignals } from '@preact/signals-react/runtime';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Package
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SkeletonTable } from '@/components/ui/Skeleton';
import { useApiQuery } from '@/hooks/useApi';
import { productApi } from '@/services/api';
import { 
  productsState, 
  filteredProducts, 
  searchQuery, 
  setSearchQuery,
  productsLoading,
  productsError
} from '@/store/signals';
import { formatCurrency } from '@/lib/utils';
import { ROUTES } from '@/constants';

const ProductsList: React.FC = () => {
  useSignals();
  const navigate = useNavigate();

  // Fetch products
  const { data: products, isLoading, error } = useApiQuery(
    ['products'],
    productApi.getAll,
    {
      onSuccess: (data) => {
        productsState.value = data;
      },
    }
  );

  useEffect(() => {
    productsLoading.value = isLoading;
    productsError.value = error?.message || null;
  }, [isLoading, error]);

  const handleCreateProduct = () => {
    navigate(ROUTES.PRODUCT_CREATE);
  };

  const handleViewProduct = (id: number) => {
    navigate(`${ROUTES.PRODUCTS}/${id}`);
  };

  const handleEditProduct = (id: number) => {
    navigate(`${ROUTES.PRODUCTS}/${id}/edit`);
  };

  const handleDeleteProduct = (id: number) => {
    // TODO: Implement delete functionality
    console.log('Delete product:', id);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Products</h1>
            <p className="text-muted-foreground">Manage your product catalog</p>
          </div>
        </div>
        <SkeletonTable rows={10} />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            Manage your product catalog ({filteredProducts.value.length} products)
          </p>
        </div>
        <Button onClick={handleCreateProduct}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery.value}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      {filteredProducts.value.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchQuery.value 
                ? "No products match your search criteria. Try adjusting your search terms."
                : "Get started by creating your first product."
              }
            </p>
            {!searchQuery.value && (
              <Button onClick={handleCreateProduct}>
                <Plus className="mr-2 h-4 w-4" />
                Create Product
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.value.map((product, index) => (
            <motion.div
              key={product.productId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="group hover:shadow-lg transition-all duration-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{product.productName}</CardTitle>
                      <CardDescription className="mt-1">
                        {product.productSku} • {product.brand}
                      </CardDescription>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">
                        {formatCurrency(product.salePrice)}
                      </span>
                      <Badge variant={product.stockQuantity > 10 ? 'success' : 'warning'}>
                        {product.stockQuantity} in stock
                      </Badge>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Category</p>
                      <Badge variant="outline">{product.categoryName}</Badge>
                    </div>

                    {product.productDescription && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {product.productDescription}
                      </p>
                    )}

                    <div className="flex items-center space-x-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewProduct(product.productId)}
                      >
                        <Eye className="mr-2 h-3 w-3" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditProduct(product.productId)}
                      >
                        <Edit className="mr-2 h-3 w-3" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteProduct(product.productId)}
                      >
                        <Trash2 className="mr-2 h-3 w-3" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default ProductsList;