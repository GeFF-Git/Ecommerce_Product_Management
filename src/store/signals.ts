import { signal, computed } from '@preact/signals-react';
import type { 
  Category, 
  Product, 
  ThemeMode, 
  UserPreferences, 
  Notification,
  DashboardStats,
  ProductFilters,
  CategoryFilters
} from '@/types';
import { THEME_CONFIG, STORAGE_KEYS } from '@/constants';

// Theme Management
export const themeMode = signal<ThemeMode>(
  (localStorage.getItem(STORAGE_KEYS.THEME) as ThemeMode) || THEME_CONFIG.DEFAULT_THEME
);

export const isDarkMode = computed(() => {
  if (themeMode.value === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return themeMode.value === 'dark';
});

// Categories State
export const categoriesState = signal<Category[]>([]);
export const categoriesLoading = signal<boolean>(false);
export const categoriesError = signal<string | null>(null);
export const selectedCategory = signal<Category | null>(null);

// Products State
export const productsState = signal<Product[]>([]);
export const productsLoading = signal<boolean>(false);
export const productsError = signal<string | null>(null);
export const selectedProduct = signal<Product | null>(null);

// UI State
export const sidebarOpen = signal<boolean>(
  localStorage.getItem(STORAGE_KEYS.SIDEBAR_STATE) !== 'false'
);
export const currentPage = signal<string>('dashboard');
export const commandPaletteOpen = signal<boolean>(false);

// Search and Filters
export const searchQuery = signal<string>('');
export const productFilters = signal<ProductFilters>({});
export const categoryFilters = signal<CategoryFilters>({});

// Notifications
export const notifications = signal<Notification[]>([]);

// Dashboard State
export const dashboardStats = signal<DashboardStats>({
  totalProducts: 0,
  totalCategories: 0,
  lowStockProducts: 0,
  totalValue: 0,
  recentActivities: [],
});

// User Preferences
export const userPreferences = signal<UserPreferences>({
  theme: THEME_CONFIG.DEFAULT_THEME,
  sidebarCollapsed: false,
  tablePageSize: 10,
  notifications: {
    email: true,
    push: true,
    lowStock: true,
  },
});

// Loading States
export const globalLoading = signal<boolean>(false);

// Computed Values
export const filteredProducts = computed(() => {
  let products = productsState.value;
  const filters = productFilters.value;
  const query = searchQuery.value.toLowerCase();

  // Apply search query
  if (query) {
    products = products.filter(product => 
      product.productName.toLowerCase().includes(query) ||
      product.productSku.toLowerCase().includes(query) ||
      product.brand.toLowerCase().includes(query) ||
      product.categoryName.toLowerCase().includes(query)
    );
  }

  // Apply category filter
  if (filters.categoryId) {
    products = products.filter(product => product.categoryId === filters.categoryId);
  }

  // Apply price range filter
  if (filters.minPrice !== undefined) {
    products = products.filter(product => product.salePrice >= filters.minPrice!);
  }
  if (filters.maxPrice !== undefined) {
    products = products.filter(product => product.salePrice <= filters.maxPrice!);
  }

  // Apply stock filter
  if (filters.inStock !== undefined) {
    products = products.filter(product => 
      filters.inStock ? product.stockQuantity > 0 : product.stockQuantity === 0
    );
  }

  // Apply brand filter
  if (filters.brand) {
    products = products.filter(product => 
      product.brand.toLowerCase().includes(filters.brand!.toLowerCase())
    );
  }

  return products;
});

export const filteredCategories = computed(() => {
  let categories = categoriesState.value;
  const filters = categoryFilters.value;
  const query = searchQuery.value.toLowerCase();

  // Apply search query
  if (query) {
    categories = categories.filter(category =>
      category.categoryName.toLowerCase().includes(query) ||
      (category.categoryDescription && category.categoryDescription.toLowerCase().includes(query))
    );
  }

  // Apply active filter
  if (filters.isActive !== undefined) {
    categories = categories.filter(category => category.isActive === filters.isActive);
  }

  return categories;
});

export const lowStockProducts = computed(() => 
  productsState.value.filter(product => product.stockQuantity < 10)
);

export const totalInventoryValue = computed(() =>
  productsState.value.reduce((total, product) => 
    total + (product.salePrice * product.stockQuantity), 0
  )
);

export const productsByCategory = computed(() => {
  const categoryMap = new Map<string, number>();
  productsState.value.forEach(product => {
    const count = categoryMap.get(product.categoryName) || 0;
    categoryMap.set(product.categoryName, count + 1);
  });
  return Array.from(categoryMap.entries()).map(([name, value]) => ({ name, value }));
});

// Actions
export const setTheme = (theme: ThemeMode) => {
  themeMode.value = theme;
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
  
  // Apply theme to document
  const root = document.documentElement;
  if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

export const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
  localStorage.setItem(STORAGE_KEYS.SIDEBAR_STATE, sidebarOpen.value.toString());
};

export const setCurrentPage = (page: string) => {
  currentPage.value = page;
};

export const setSearchQuery = (query: string) => {
  searchQuery.value = query;
};

export const setProductFilters = (filters: Partial<ProductFilters>) => {
  productFilters.value = { ...productFilters.value, ...filters };
};

export const setCategoryFilters = (filters: Partial<CategoryFilters>) => {
  categoryFilters.value = { ...categoryFilters.value, ...filters };
};

export const clearFilters = () => {
  productFilters.value = {};
  categoryFilters.value = {};
  searchQuery.value = '';
};

export const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
  const newNotification: Notification = {
    ...notification,
    id: Math.random().toString(36).substr(2, 9),
    timestamp: new Date().toISOString(),
  };
  
  notifications.value = [newNotification, ...notifications.value].slice(0, 5);
};

export const removeNotification = (id: string) => {
  notifications.value = notifications.value.filter(n => n.id !== id);
};

export const markNotificationAsRead = (id: string) => {
  notifications.value = notifications.value.map(n => 
    n.id === id ? { ...n, read: true } : n
  );
};

export const toggleCommandPalette = () => {
  commandPaletteOpen.value = !commandPaletteOpen.value;
};

export const setGlobalLoading = (loading: boolean) => {
  globalLoading.value = loading;
};

// Initialize theme on load
const initializeTheme = () => {
  const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) as ThemeMode;
  if (savedTheme) {
    setTheme(savedTheme);
  } else {
    setTheme(THEME_CONFIG.DEFAULT_THEME);
  }
};

// Listen for system theme changes
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
mediaQuery.addEventListener('change', () => {
  if (themeMode.value === 'system') {
    setTheme('system');
  }
});

// Initialize theme
initializeTheme();