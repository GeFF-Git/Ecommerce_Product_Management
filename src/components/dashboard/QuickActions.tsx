import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, Package, FolderOpen, Upload, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants';

const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  const actions = [
    {
      label: 'Add Product',
      description: 'Create a new product',
      icon: Plus,
      action: () => navigate(ROUTES.PRODUCT_CREATE),
      color: 'text-blue-600',
    },
    {
      label: 'Add Category',
      description: 'Create a new category',
      icon: FolderOpen,
      action: () => navigate(ROUTES.CATEGORY_CREATE),
      color: 'text-green-600',
    },
    {
      label: 'View Products',
      description: 'Browse all products',
      icon: Package,
      action: () => navigate(ROUTES.PRODUCTS),
      color: 'text-purple-600',
    },
    {
      label: 'Import Data',
      description: 'Import from CSV/Excel',
      icon: Upload,
      action: () => {}, // TODO: Implement import
      color: 'text-orange-600',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks and shortcuts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          {actions.map((action, index) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Button
                variant="ghost"
                className="w-full justify-start h-auto p-3"
                onClick={action.action}
              >
                <action.icon className={`mr-3 h-4 w-4 ${action.color}`} />
                <div className="text-left">
                  <div className="font-medium">{action.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {action.description}
                  </div>
                </div>
              </Button>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;