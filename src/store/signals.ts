import { signal, computed } from '@preact/signals-react';
import type { Category, Product, ThemeMode, LoadingState } from '@/types';

// Theme Management
export const themeMode = signal<ThemeMode>('light');
export const isDarkMode = computed(() => themeMode.value === 'dark');

// Categories State
export const categoriesState = signal<Category[]>([]);
export const categoriesLoading = signal<LoadingState>({ isLoading: false, error: null });
export const selectedCategory = signal<Category | null>(null);

// Products State
export const productsState = signal<Product[]>([]);
export const productsLoading = signal<LoadingState>({ isLoading: false, error: null });
export const selectedProduct = signal<Product | null>(null);

// UI State
export const sidebarOpen = signal<boolean>(true);
export const currentPage = signal<string>('dashboard');

// Search and Filters
export const searchQuery = signal<string>('');
export const categoryFilter = signal<number | null>(null);

// Computed values
export const filteredProducts = computed(() => {
  let products = productsState.value;
  
  if (searchQuery.value) {
    products = products.filter(product => 
      product.productName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      product.productSku.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }
  
  if (categoryFilter.value) {
    products = products.filter(product => product.categoryId === categoryFilter.value);
  }
  
  return products;
});

export const filteredCategories = computed(() => {
  if (!searchQuery.value) return categoriesState.value;
  
  return categoriesState.value.filter(category =>
    category.categoryName.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Actions
export const toggleTheme = () => {
  themeMode.value = themeMode.value === 'light' ? 'dark' : 'light';
  localStorage.setItem('theme', themeMode.value);
  document.documentElement.classList.toggle('dark', themeMode.value === 'dark');
};

export const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

export const setCurrentPage = (page: string) => {
  currentPage.value = page;
};

export const setSearchQuery = (query: string) => {
  searchQuery.value = query;
};

export const setCategoryFilter = (categoryId: number | null) => {
  categoryFilter.value = categoryId;
};

// Initialize theme from localStorage
const savedTheme = localStorage.getItem('theme') as ThemeMode;
if (savedTheme) {
  themeMode.value = savedTheme;
  document.documentElement.classList.toggle('dark', savedTheme === 'dark');
}