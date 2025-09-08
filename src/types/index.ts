// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Data Types
export interface AttributeDataType {
  dataTypeId: number;
  dataTypeName: string;
  isActive: boolean;
}

// Category Types
export interface Category {
  categoryId: number;
  categoryName: string;
  categoryDescription?: string;
  isActive: boolean;
  attributes: CategoryAttribute[];
}

export interface CategoryAttribute {
  attributeId: number;
  attributeName: string;
  attributeDisplayName: string;
  dataTypeId: number;
  isActive: boolean;
}

export interface CreateCategoryDto {
  categoryName: string;
  categoryDescription?: string;
  attributes?: CreateCategoryAttributeDto[];
}

export interface CreateCategoryAttributeDto {
  attributeName: string;
  attributeDisplayName: string;
  dataTypeId: number;
}

export interface UpdateCategoryDto {
  categoryName: string;
  categoryDescription?: string;
}

export interface UpdateCategoryAttributeDto {
  attributeName: string;
  attributeDisplayName: string;
}

// Product Types
export interface Product {
  productId: number;
  categoryId: number;
  categoryName: string;
  productSku: string;
  productName: string;
  brand: string;
  productDescription?: string;
  salePrice: number;
  stockQuantity: number;
  isActive?: boolean;
  attributes: ProductAttributeValue[];
}

export interface ProductAttributeValue {
  attributeName: string;
  attributeDisplayName: string;
  value?: string;
}

export interface CreateProductDto {
  categoryId: number;
  productSku: string;
  productName: string;
  brand: string;
  productDescription?: string;
  salePrice: number;
  stockQuantity: number;
  attributes?: CreateProductAttributeValueDto[];
}

export interface CreateProductAttributeValueDto {
  attributeId: number;
  value?: string;
}

export interface UpdateProductDto {
  productSku: string;
  productName: string;
  productDescription?: string;
  salePrice: number;
  stockQuantity: number;
}

export interface UpdateProductAttributeValueDto {
  value?: string;
}

// Theme Types
export type ThemeMode = 'light' | 'dark' | 'system';

// Navigation Types
export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: NavigationItem[];
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'textarea' | 'select' | 'checkbox' | 'date';
  required?: boolean;
  options?: { value: string | number; label: string }[];
  validation?: any;
}

// Table Types
export interface TableColumn<T = any> {
  field: keyof T;
  headerName: string;
  width?: number;
  flex?: number;
  sortable?: boolean;
  filterable?: boolean;
  renderCell?: (params: any) => React.ReactNode;
}

// Loading and Error States
export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
}

// Pagination
export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

// Dashboard Analytics
export interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  lowStockProducts: number;
  totalValue: number;
  recentActivities: Activity[];
}

export interface Activity {
  id: string;
  type: 'product_created' | 'product_updated' | 'category_created' | 'category_updated';
  title: string;
  description: string;
  timestamp: string;
  userId?: string;
}

// Chart Data
export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

// Filter Types
export interface ProductFilters {
  search?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  brand?: string;
}

export interface CategoryFilters {
  search?: string;
  isActive?: boolean;
}

// Command Palette
export interface Command {
  id: string;
  label: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  action: () => void;
  shortcut?: string[];
}

// Notification Types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

// User Preferences
export interface UserPreferences {
  theme: ThemeMode;
  sidebarCollapsed: boolean;
  tablePageSize: number;
  notifications: {
    email: boolean;
    push: boolean;
    lowStock: boolean;
  };
}

// Error Types
export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

// File Upload
export interface FileUpload {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

// Bulk Operations
export interface BulkOperation {
  type: 'delete' | 'update' | 'export';
  selectedIds: number[];
  status: 'idle' | 'processing' | 'success' | 'error';
  progress?: number;
}