// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
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

// Data Types
export interface AttributeDataType {
  dataTypeId: number;
  dataTypeName: string;
  isActive: boolean;
}

// Theme Types
export type ThemeMode = 'light' | 'dark';

// Navigation Types
export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon: React.ComponentType;
  children?: NavigationItem[];
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'textarea' | 'select' | 'checkbox';
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