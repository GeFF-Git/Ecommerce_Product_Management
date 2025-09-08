import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Package, Tag, DollarSign, Archive } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useApiQuery } from '@/hooks/useApi';
import { productApi } from '@/services/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ROUTES } from '@/constants';

const ProductDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: product, isLoading, error } = useApiQuery(
    ['products', id],
    () => productApi.getById(Number(id)),
    {
      enabled: Boolean(id),
    }
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(ROUTES.PRODUCTS)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="h-8 w-48 bg-muted animate-pulse rounded" />
            <div className="h-4 w-32 bg-muted animate-pulse rounded mt-2" />
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-64 bg-muted animate-pulse rounded-lg" />
            <div className="h-32 bg-muted animate-pulse rounded-lg" />
          </div>
          <div className="space-y-6">
            <div className="h-48 bg-muted animate-pulse rounded-lg" />
            <div className="h-32 bg-muted animate-pulse rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(ROUTES.PRODUCTS)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Product Not Found</h1>
            <p className="text-muted-foreground">The requested product could not be found.</p>
          </div>
        </div>
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
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(ROUTES.PRODUCTS)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{product.productName}</h1>
            <p className="text-muted-foreground">{product.productSku} • {product.brand}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => navigate(`${ROUTES.PRODUCTS}/${id}/edit`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="outline">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-5 w-5" />
                Product Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Product Name</label>
                  <p className="text-lg font-medium">{product.productName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Brand</label>
                  <p className="text-lg font-medium">{product.brand}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">SKU</label>
                <p className="text-lg font-medium font-mono">{product.productSku}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Category</label>
                <div className="mt-1">
                  <Badge variant="outline">{product.categoryName}</Badge>
                </div>
              </div>

              {product.productDescription && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  <p className="text-sm mt-1 leading-relaxed">{product.productDescription}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Product Attributes */}
          {product.attributes && product.attributes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Product Attributes</CardTitle>
                <CardDescription>Additional product specifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {product.attributes.map((attribute, index) => (
                    <div key={index}>
                      <label className="text-sm font-medium text-muted-foreground">
                        {attribute.attributeDisplayName}
                      </label>
                      <p className="text-sm mt-1">
                        {attribute.value || 'Not specified'}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pricing & Stock */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="mr-2 h-5 w-5" />
                Pricing & Stock
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Sale Price</label>
                <p className="text-2xl font-bold">{formatCurrency(product.salePrice)}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Stock Quantity</label>
                <div className="flex items-center space-x-2 mt-1">
                  <p className="text-lg font-medium">{product.stockQuantity}</p>
                  <Badge variant={product.stockQuantity > 10 ? 'success' : 'warning'}>
                    {product.stockQuantity > 10 ? 'In Stock' : 'Low Stock'}
                  </Badge>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="mt-1">
                  <Badge variant={product.isActive !== false ? 'success' : 'secondary'}>
                    {product.isActive !== false ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Edit className="mr-2 h-4 w-4" />
                Edit Product
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Archive className="mr-2 h-4 w-4" />
                Archive Product
              </Button>
              <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Product
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetail;