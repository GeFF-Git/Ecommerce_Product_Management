import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  useTheme,
  alpha,
  LinearProgress,
  Chip,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Inventory as InventoryIcon,
  Category as CategoryIcon,
  ShoppingCart as ShoppingCartIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { useSignals } from '@preact/signals-react/runtime';
import { categoriesState, productsState } from '@/store/signals';
import { formatCurrency } from '@/utils/helpers';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color, 
  trend 
}) => {
  const theme = useTheme();

  return (
    <Card
      className="card-hover"
      sx={{
        height: '100%',
        background: `linear-gradient(135deg, ${alpha(color, 0.1)}, ${alpha(color, 0.05)})`,
        border: `1px solid ${alpha(color, 0.2)}`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: '0.875rem',
                fontWeight: 500,
                mb: 1,
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="h3"
              sx={{
                color: theme.palette.text.primary,
                fontWeight: 700,
                mb: 0.5,
                fontSize: '2rem',
              }}
            >
              {value}
            </Typography>
            {subtitle && (
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: '0.8rem',
                }}
              >
                {subtitle}
              </Typography>
            )}
            {trend && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Chip
                  size="small"
                  label={`${trend.isPositive ? '+' : ''}${trend.value}%`}
                  sx={{
                    backgroundColor: trend.isPositive 
                      ? alpha(theme.palette.success.main, 0.1)
                      : alpha(theme.palette.error.main, 0.1),
                    color: trend.isPositive 
                      ? theme.palette.success.main
                      : theme.palette.error.main,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.secondary,
                    ml: 1,
                  }}
                >
                  vs last month
                </Typography>
              </Box>
            )}
          </Box>
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: 3,
              backgroundColor: alpha(color, 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              ml: 2,
            }}
          >
            <Icon sx={{ fontSize: '2rem', color }} />
          </Box>
        </Box>
      </CardContent>
      
      {/* Decorative element */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${color}, ${alpha(color, 0.5)})`,
        }}
      />
    </Card>
  );
};

const Dashboard: React.FC = () => {
  useSignals();
  const theme = useTheme();

  // Calculate statistics from current data
  const totalCategories = categoriesState.value.length;
  const totalProducts = productsState.value.length;
  const activeProducts = productsState.value.filter(p => p.isActive !== false).length;
  const totalValue = productsState.value.reduce((sum, product) => sum + (product.salePrice * product.stockQuantity), 0);
  const lowStockProducts = productsState.value.filter(p => p.stockQuantity < 10).length;

  const stats = [
    {
      title: 'Total Products',
      value: totalProducts,
      subtitle: `${activeProducts} active`,
      icon: InventoryIcon,
      color: theme.palette.primary.main,
      trend: { value: 12, isPositive: true },
    },
    {
      title: 'Categories',
      value: totalCategories,
      subtitle: 'Product categories',
      icon: CategoryIcon,
      color: theme.palette.secondary.main,
      trend: { value: 8, isPositive: true },
    },
    {
      title: 'Inventory Value',
      value: formatCurrency(totalValue),
      subtitle: 'Total stock value',
      icon: MoneyIcon,
      color: theme.palette.success.main,
      trend: { value: 15, isPositive: true },
    },
    {
      title: 'Low Stock Items',
      value: lowStockProducts,
      subtitle: 'Need restocking',
      icon: TrendingUpIcon,
      color: theme.palette.warning.main,
      trend: { value: -5, isPositive: false },
    },
  ];

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: theme.palette.text.primary,
            mb: 1,
          }}
        >
          Dashboard
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text.secondary,
          }}
        >
          Welcome back! Here's what's happening with your product catalog.
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions and Recent Activity */}
      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Card className="card-hover">
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  color: theme.palette.text.primary,
                }}
              >
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      transform: 'translateY(-1px)',
                    },
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Add New Product
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                    Create a new product in your catalog
                  </Typography>
                </Box>
                
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: alpha(theme.palette.secondary.main, 0.05),
                    border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                      transform: 'translateY(-1px)',
                    },
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Create Category
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                    Add a new product category
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <Card className="card-hover">
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  color: theme.palette.text.primary,
                }}
              >
                Recent Activity
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  { action: 'Product created', item: 'iPhone 15 Pro', time: '2 hours ago' },
                  { action: 'Category updated', item: 'Smartphones', time: '4 hours ago' },
                  { action: 'Stock updated', item: 'Samsung Galaxy S24', time: '6 hours ago' },
                ].map((activity, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: alpha(theme.palette.grey[500], 0.05),
                      border: `1px solid ${alpha(theme.palette.grey[500], 0.1)}`,
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {activity.action}
                      </Typography>
                      <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                        {activity.item}
                      </Typography>
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: theme.palette.text.secondary,
                        fontSize: '0.75rem',
                      }}
                    >
                      {activity.time}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;