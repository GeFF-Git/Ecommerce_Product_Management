import React from 'react';
import { motion } from 'framer-motion';
import { useSignals } from '@preact/signals-react/runtime';
import { 
  Package, 
  FolderOpen, 
  TrendingUp, 
  AlertTriangle,
  DollarSign,
  ShoppingCart,
  Users,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SkeletonStats } from '@/components/ui/Skeleton';
import { 
  productsState, 
  categoriesState, 
  lowStockProducts, 
  totalInventoryValue,
  productsByCategory
} from '@/store/signals';
import { formatCurrency, formatNumber } from '@/lib/utils';
import StatsCard from '@/components/dashboard/StatsCard';
import ChartCard from '@/components/dashboard/ChartCard';
import RecentActivity from '@/components/dashboard/RecentActivity';
import QuickActions from '@/components/dashboard/QuickActions';

const Dashboard: React.FC = () => {
  useSignals();

  const stats = [
    {
      title: 'Total Products',
      value: formatNumber(productsState.value.length),
      description: 'Active products in catalog',
      icon: Package,
      trend: { value: 12, isPositive: true },
      color: 'text-blue-600',
    },
    {
      title: 'Categories',
      value: formatNumber(categoriesState.value.length),
      description: 'Product categories',
      icon: FolderOpen,
      trend: { value: 8, isPositive: true },
      color: 'text-green-600',
    },
    {
      title: 'Inventory Value',
      value: formatCurrency(totalInventoryValue.value),
      description: 'Total stock value',
      icon: DollarSign,
      trend: { value: 15, isPositive: true },
      color: 'text-purple-600',
    },
    {
      title: 'Low Stock Items',
      value: formatNumber(lowStockProducts.value.length),
      description: 'Items need restocking',
      icon: AlertTriangle,
      trend: { value: -5, isPositive: false },
      color: 'text-orange-600',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's what's happening with your store.
            </p>
          </div>
          <Badge variant="outline" className="text-sm">
            <Activity className="mr-1 h-3 w-3" />
            Live Data
          </Badge>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <StatsCard key={stat.title} {...stat} index={index} />
          ))}
        </div>
      </motion.div>

      {/* Charts and Activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Charts */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
          <ChartCard
            title="Products by Category"
            description="Distribution of products across categories"
            data={productsByCategory.value}
            type="pie"
          />
          
          <ChartCard
            title="Inventory Trends"
            description="Stock levels over time"
            data={[
              { name: 'Jan', value: 400 },
              { name: 'Feb', value: 300 },
              { name: 'Mar', value: 500 },
              { name: 'Apr', value: 280 },
              { name: 'May', value: 590 },
              { name: 'Jun', value: 320 },
            ]}
            type="line"
          />
        </motion.div>

        {/* Sidebar */}
        <motion.div variants={itemVariants} className="space-y-6">
          <QuickActions />
          <RecentActivity />
          
          {/* Low Stock Alert */}
          {lowStockProducts.value.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-orange-600">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Low Stock Alert
                </CardTitle>
                <CardDescription>
                  {lowStockProducts.value.length} items need restocking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {lowStockProducts.value.slice(0, 3).map((product) => (
                    <div key={product.productId} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{product.productName}</p>
                        <p className="text-xs text-muted-foreground">{product.productSku}</p>
                      </div>
                      <Badge variant="destructive" className="text-xs">
                        {product.stockQuantity} left
                      </Badge>
                    </div>
                  ))}
                  {lowStockProducts.value.length > 3 && (
                    <p className="text-xs text-muted-foreground text-center pt-2">
                      +{lowStockProducts.value.length - 3} more items
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;