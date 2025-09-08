import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save, Package } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { useApiMutation, useApiQuery } from '@/hooks/useApi';
import { productApi, categoryApi } from '@/services/api';
import { ROUTES } from '@/constants';
import { addNotification } from '@/store/signals';

const productSchema = z.object({
  categoryId: z.number().min(1, 'Category is required'),
  productSku: z.string().min(1, 'SKU is required'),
  productName: z.string().min(1, 'Product name is required'),
  brand: z.string().min(1, 'Brand is required'),
  productDescription: z.string().optional(),
  salePrice: z.number().min(0.01, 'Price must be greater than 0'),
  stockQuantity: z.number().min(0, 'Stock quantity cannot be negative'),
});

type ProductFormData = z.infer<typeof productSchema>;

const ProductForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  // Fetch categories for dropdown
  const { data: categories = [] } = useApiQuery(
    ['categories'],
    categoryApi.getAll
  );

  // Fetch product data if editing
  const { data: product } = useApiQuery(
    ['products', id],
    () => productApi.getById(Number(id)),
    {
      enabled: isEditing,
    }
  );

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      categoryId: 0,
      productSku: '',
      productName: '',
      brand: '',
      productDescription: '',
      salePrice: 0,
      stockQuantity: 0,
    },
  });

  // Update form when product data is loaded
  React.useEffect(() => {
    if (product) {
      form.reset({
        categoryId: product.categoryId,
        productSku: product.productSku,
        productName: product.productName,
        brand: product.brand,
        productDescription: product.productDescription || '',
        salePrice: product.salePrice,
        stockQuantity: product.stockQuantity,
      });
    }
  }, [product, form]);

  const createMutation = useApiMutation(productApi.create, {
    onSuccess: () => {
      addNotification({
        type: 'success',
        title: 'Success',
        message: 'Product created successfully',
        read: false,
      });
      navigate(ROUTES.PRODUCTS);
    },
  });

  const updateMutation = useApiMutation(
    ({ id, data }: { id: number; data: any }) => productApi.update(id, data),
    {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Success',
          message: 'Product updated successfully',
          read: false,
        });
        navigate(ROUTES.PRODUCTS);
      },
    }
  );

  const onSubmit = (data: ProductFormData) => {
    if (isEditing) {
      updateMutation.mutate({ id: Number(id), data });
    } else {
      createMutation.mutate(data);
    }
  };

  const isLoading = createMutation.isLoading || updateMutation.isLoading;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(ROUTES.PRODUCTS)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEditing ? 'Edit Product' : 'Create Product'}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? 'Update product information' : 'Add a new product to your catalog'}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Information */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="mr-2 h-5 w-5" />
                  Product Information
                </CardTitle>
                <CardDescription>
                  Basic information about the product
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    label="Product Name"
                    placeholder="Enter product name"
                    {...form.register('productName')}
                    error={form.formState.errors.productName?.message}
                    required
                  />
                  <Input
                    label="Brand"
                    placeholder="Enter brand name"
                    {...form.register('brand')}
                    error={form.formState.errors.brand?.message}
                    required
                  />
                </div>

                <Input
                  label="SKU"
                  placeholder="Enter product SKU"
                  {...form.register('productSku')}
                  error={form.formState.errors.productSku?.message}
                  required
                />

                <div>
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Description
                  </label>
                  <textarea
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-2"
                    placeholder="Enter product description"
                    {...form.register('productDescription')}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Category & Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>Category & Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Category <span className="text-destructive">*</span>
                  </label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-2"
                    {...form.register('categoryId', { valueAsNumber: true })}
                  >
                    <option value={0}>Select a category</option>
                    {categories.map((category) => (
                      <option key={category.categoryId} value={category.categoryId}>
                        {category.categoryName}
                      </option>
                    ))}
                  </select>
                  {form.formState.errors.categoryId && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.categoryId.message}
                    </p>
                  )}
                </div>

                <Input
                  label="Sale Price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...form.register('salePrice', { valueAsNumber: true })}
                  error={form.formState.errors.salePrice?.message}
                  required
                />

                <Input
                  label="Stock Quantity"
                  type="number"
                  placeholder="0"
                  {...form.register('stockQuantity', { valueAsNumber: true })}
                  error={form.formState.errors.stockQuantity?.message}
                  required
                />
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col space-y-2">
                  <Button type="submit" loading={isLoading}>
                    <Save className="mr-2 h-4 w-4" />
                    {isEditing ? 'Update Product' : 'Create Product'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(ROUTES.PRODUCTS)}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default ProductForm;