import React from 'react';
import { motion } from 'framer-motion';
import { Package, FolderOpen, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatRelativeTime } from '@/lib/utils';

interface Activity {
  id: string;
  type: 'product_created' | 'product_updated' | 'category_created' | 'category_updated' | 'product_deleted';
  title: string;
  description: string;
  timestamp: string;
}

const RecentActivity: React.FC = () => {
  // Mock data - in real app, this would come from API
  const activities: Activity[] = [
    {
      id: '1',
      type: 'product_created',
      title: 'New product added',
      description: 'iPhone 15 Pro Max',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    },
    {
      id: '2',
      type: 'category_updated',
      title: 'Category updated',
      description: 'Electronics category',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    },
    {
      id: '3',
      type: 'product_updated',
      title: 'Product updated',
      description: 'Samsung Galaxy S24',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    },
    {
      id: '4',
      type: 'product_deleted',
      title: 'Product removed',
      description: 'Old iPhone model',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    },
  ];

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'product_created':
      case 'product_updated':
        return Package;
      case 'category_created':
      case 'category_updated':
        return FolderOpen;
      case 'product_deleted':
        return Trash2;
      default:
        return Edit;
    }
  };

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'product_created':
      case 'category_created':
        return 'text-green-600';
      case 'product_updated':
      case 'category_updated':
        return 'text-blue-600';
      case 'product_deleted':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getActivityBadge = (type: Activity['type']) => {
    switch (type) {
      case 'product_created':
      case 'category_created':
        return { variant: 'success' as const, label: 'Created' };
      case 'product_updated':
      case 'category_updated':
        return { variant: 'info' as const, label: 'Updated' };
      case 'product_deleted':
        return { variant: 'destructive' as const, label: 'Deleted' };
      default:
        return { variant: 'secondary' as const, label: 'Action' };
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest changes to your catalog</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const Icon = getActivityIcon(activity.type);
            const color = getActivityColor(activity.type);
            const badge = getActivityBadge(activity.type);

            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className={`rounded-full p-2 bg-muted ${color}`}>
                  <Icon className="h-3 w-3" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium truncate">{activity.title}</p>
                    <Badge variant={badge.variant} className="text-xs">
                      {badge.label}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {activity.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatRelativeTime(activity.timestamp)}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;