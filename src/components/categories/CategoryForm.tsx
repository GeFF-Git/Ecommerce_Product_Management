import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save, FolderOpen, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { useApiMutation, useApiQuery } from '@/hooks/useApi';
import { categoryApi } from '@/services/api';
import { ROUTES, DATA_TYPES, DATA_TYPE_NAMES } from '@/constants';
import { addNotification } from '@/store/signals';

const categorySchema = z.object({
  categoryName: z.string().min(1, 'Category name is required'),
  categoryDescription: z.string().optional(),
  attributes: z.array(z.object({
    attributeName: z.string().min(1, 'Attribute name is required'),
    attributeDisplayName: z.string().min(1, 'Display name is required'),
    dataTypeId: z.number().min(1, 'Data type is required'),
  })).optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

const CategoryForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  // Fetch category data if editing
  const { data: category } = useApiQuery(
    ['categories', id],
    () => categoryApi.getById(Number(id)),
    {
      enabled: isEditing,
    }
  );

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      categoryName: '',
      categoryDescription: '',
      attributes: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'attributes',
  });

  // Update form when category data is loaded
  React.useEffect(() => {
    if (category) {
      form.reset({
        categoryName: category.categoryName,
        categoryDescription: category.categoryDescription || '',
        attributes: category.attributes.map(attr => ({
          attributeName: attr.attributeName,
          attributeDisplayName: attr.attributeDisplayName,
          dataTypeId: attr.dataTypeId,
        })),
      });
    }
  }, [category, form]);

  const createMutation = useApiMutation(categoryApi.create, {
    onSuccess: () => {
      addNotification({
        type: 'success',
        title: 'Success',
        message: 'Category created successfully',
        read: false,
      });
      navigate(ROUTES.CATEGORIES);
    },
  });

  const updateMutation = useApiMutation(
    ({ id, data }: { id: number; data: any }) => categoryApi.update(id, data),
    {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Success',
          message: 'Category updated successfully',
          read: false,
        });
        navigate(ROUTES.CATEGORIES);
      },
    }
  );

  const onSubmit = (data: CategoryFormData) => {
    if (isEditing) {
      updateMutation.mutate({ id: Number(id), data });
    } else {
      createMutation.mutate(data);
    }
  };

  const addAttribute = () => {
    append({
      attributeName: '',
      attributeDisplayName: '',
      dataTypeId: DATA_TYPES.STRING,
    });
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
        <Button variant="ghost" size="icon" onClick={() => navigate(ROUTES.CATEGORIES)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEditing ? 'Edit Category' : 'Create Category'}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? 'Update category information' : 'Add a new category to organize your products'}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FolderOpen className="mr-2 h-5 w-5" />
                  Category Information
                </CardTitle>
                <CardDescription>
                  Basic information about the category
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Category Name"
                  placeholder="Enter category name"
                  {...form.register('categoryName')}
                  error={form.formState.errors.categoryName?.message}
                  required
                />

                <div>
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Description
                  </label>
                  <textarea
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-2"
                    placeholder="Enter category description"
                    {...form.register('categoryDescription')}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Attributes */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Category Attributes</CardTitle>
                    <CardDescription>
                      Define custom attributes for products in this category
                    </CardDescription>
                  </div>
                  <Button type="button" variant="outline" onClick={addAttribute}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Attribute
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {fields.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No attributes defined yet.</p>
                    <p className="text-sm">Click "Add Attribute" to create custom fields for this category.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {fields.map((field, index) => (
                      <motion.div
                        key={field.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 border rounded-lg space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Attribute {index + 1}</h4>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <Input
                            label="Attribute Name"
                            placeholder="e.g., color, size"
                            {...form.register(`attributes.${index}.attributeName`)}
                            error={form.formState.errors.attributes?.[index]?.attributeName?.message}
                          />
                          <Input
                            label="Display Name"
                            placeholder="e.g., Color, Size"
                            {...form.register(`attributes.${index}.attributeDisplayName`)}
                            error={form.formState.errors.attributes?.[index]?.attributeDisplayName?.message}
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Data Type
                          </label>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-2"
                            {...form.register(`attributes.${index}.dataTypeId`, { valueAsNumber: true })}
                          >
                            {Object.entries(DATA_TYPE_NAMES).map(([id, name]) => (
                              <option key={id} value={Number(id)}>
                                {name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col space-y-2">
                  <Button type="submit" loading={isLoading}>
                    <Save className="mr-2 h-4 w-4" />
                    {isEditing ? 'Update Category' : 'Create Category'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(ROUTES.CATEGORIES)}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Help */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Tips</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>• Use clear, descriptive names for categories</p>
                <p>• Add attributes that are common to all products in this category</p>
                <p>• Choose appropriate data types for each attribute</p>
                <p>• You can always add more attributes later</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default CategoryForm;