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
  FolderOpen,
  Tag
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SkeletonTable } from '@/components/ui/Skeleton';
import { useApiQuery } from '@/hooks/useApi';
import { categoryApi } from '@/services/api';
import { 
  categoriesState, 
  filteredCategories, 
  searchQuery, 
  setSearchQuery,
  categoriesLoading,
  categoriesError
} from '@/store/signals';
import { ROUTES } from '@/constants';

const CategoriesList: React.FC = () => {
  useSignals();
  const navigate = useNavigate();

  // Fetch categories
  const { data: categories, isLoading, error } = useApiQuery(
    ['categories'],
    categoryApi.getAll,
    {
      onSuccess: (data) => {
        categoriesState.value = data;
      },
    }
  );

  useEffect(() => {
    categoriesLoading.value = isLoading;
    categoriesError.value = error?.message || null;
  }, [isLoading, error]);

  const handleCreateCategory = () => {
    navigate(ROUTES.CATEGORY_CREATE);
  };

  const handleViewCategory = (id: number) => {
    navigate(`${ROUTES.CATEGORIES}/${id}`);
  };

  const handleEditCategory = (id: number) => {
    navigate(`${ROUTES.CATEGORIES}/${id}/edit`);
  };

  const handleDeleteCategory = (id: number) => {
    // TODO: Implement delete functionality
    console.log('Delete category:', id);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
            <p className="text-muted-foreground">Manage your product categories</p>
          </div>
        </div>
        <SkeletonTable rows={8} />
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
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">
            Manage your product categories ({filteredCategories.value.length} categories)
          </p>
        </div>
        <Button onClick={handleCreateCategory}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
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
                  placeholder="Search categories..."
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

      {/* Categories Grid */}
      {filteredCategories.value.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No categories found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchQuery.value 
                ? "No categories match your search criteria. Try adjusting your search terms."
                : "Get started by creating your first category."
              }
            </p>
            {!searchQuery.value && (
              <Button onClick={handleCreateCategory}>
                <Plus className="mr-2 h-4 w-4" />
                Create Category
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCategories.value.map((category, index) => (
            <motion.div
              key={category.categoryId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="group hover:shadow-lg transition-all duration-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center">
                        <FolderOpen className="mr-2 h-5 w-5 text-primary" />
                        {category.categoryName}
                      </CardTitle>
                      {category.categoryDescription && (
                        <CardDescription className="mt-2">
                          {category.categoryDescription}
                        </CardDescription>
                      )}
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
                      <Badge variant={category.isActive ? 'success' : 'secondary'}>
                        {category.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Tag className="mr-1 h-3 w-3" />
                        {category.attributes.length} attributes
                      </div>
                    </div>

                    {category.attributes.length > 0 && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Attributes</p>
                        <div className="flex flex-wrap gap-1">
                          {category.attributes.slice(0, 3).map((attribute) => (
                            <Badge key={attribute.attributeId} variant="outline" className="text-xs">
                              {attribute.attributeDisplayName}
                            </Badge>
                          ))}
                          {category.attributes.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{category.attributes.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewCategory(category.categoryId)}
                      >
                        <Eye className="mr-2 h-3 w-3" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditCategory(category.categoryId)}
                      >
                        <Edit className="mr-2 h-3 w-3" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteCategory(category.categoryId)}
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

export default CategoriesList;