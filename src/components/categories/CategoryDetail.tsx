import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, FolderOpen, Tag, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useApiQuery } from '@/hooks/useApi';
import { categoryApi } from '@/services/api';
import { DATA_TYPE_NAMES } from '@/constants';
import { ROUTES } from '@/constants';

const CategoryDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: category, isLoading, error } = useApiQuery(
    ['categories', id],
    () => categoryApi.getById(Number(id)),
    {
      enabled: Boolean(id),
    }
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(ROUTES.CATEGORIES)}>
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
          </div>
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(ROUTES.CATEGORIES)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Category Not Found</h1>
            <p className="text-muted-foreground">The requested category could not be found.</p>
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
          <Button variant="ghost" size="icon" onClick={() => navigate(ROUTES.CATEGORIES)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center">
              <FolderOpen className="mr-3 h-8 w-8 text-primary" />
              {category.categoryName}
            </h1>
            <p className="text-muted-foreground">
              {category.categoryDescription || 'No description provided'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => navigate(`${ROUTES.CATEGORIES}/${id}/edit`)}
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
          {/* Category Information */}
          <Card>
            <CardHeader>
              <CardTitle>Category Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Category Name</label>
                <p className="text-lg font-medium">{category.categoryName}</p>
              </div>

              {category.categoryDescription && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  <p className="text-sm mt-1 leading-relaxed">{category.categoryDescription}</p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="mt-1">
                  <Badge variant={category.isActive ? 'success' : 'secondary'}>
                    {category.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category Attributes */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Tag className="mr-2 h-5 w-5" />
                    Category Attributes
                  </CardTitle>
                  <CardDescription>
                    Custom attributes for products in this category
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Attribute
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {category.attributes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Tag className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No attributes defined</p>
                  <p className="text-sm mb-4">
                    Add custom attributes to help organize products in this category
                  </p>
                  <Button variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Add First Attribute
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {category.attributes.map((attribute, index) => (
                    <motion.div
                      key={attribute.attributeId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 border rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{attribute.attributeDisplayName}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">
                            {DATA_TYPE_NAMES[attribute.dataTypeId as keyof typeof DATA_TYPE_NAMES]}
                          </Badge>
                          <Badge variant={attribute.isActive ? 'success' : 'secondary'}>
                            {attribute.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Attribute Name: <code className="font-mono">{attribute.attributeName}</code>
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Attributes</span>
                <span className="font-medium">{category.attributes.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active Attributes</span>
                <span className="font-medium">
                  {category.attributes.filter(attr => attr.isActive).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant={category.isActive ? 'success' : 'secondary'}>
                  {category.isActive ? 'Active' : 'Inactive'}
                </Badge>
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
                Edit Category
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Plus className="mr-2 h-4 w-4" />
                Add Attribute
              </Button>
              <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Category
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default CategoryDetail;