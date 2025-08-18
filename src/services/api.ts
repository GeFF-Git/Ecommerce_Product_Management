import axios from 'axios';
import type { 
  Category, 
  Product, 
  CreateCategoryDto, 
  CreateProductDto, 
  UpdateCategoryDto, 
  UpdateProductDto,
  ApiResponse 
} from '@/types';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'https://product-management.azurewebsites.net/api', // Your deployed API URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens (if needed in future)
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    
    if (error.response?.status === 401) {
      // Handle unauthorized access
      // Could redirect to login page
    }
    
    return Promise.reject(error);
  }
);

// Category API calls
export const categoryApi = {
  getAll: async (): Promise<Category[]> => {
    const response = await api.get<Category[]>('/categories');
    return response.data;
  },

  getById: async (id: number): Promise<Category> => {
    const response = await api.get<Category>(`/categories/${id}`);
    return response.data;
  },

  create: async (category: CreateCategoryDto): Promise<Category> => {
    const response = await api.post<Category>('/categories', category);
    return response.data;
  },

  update: async (id: number, category: UpdateCategoryDto): Promise<void> => {
    await api.put(`/categories/${id}`, category);
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
};

// Product API calls
export const productApi = {
  getAll: async (): Promise<Product[]> => {
    const response = await api.get<Product[]>('/products');
    return response.data;
  },

  getById: async (id: number): Promise<Product> => {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  create: async (product: CreateProductDto): Promise<Product> => {
    const response = await api.post<Product>('/products', product);
    return response.data;
  },

  update: async (id: number, product: UpdateProductDto): Promise<void> => {
    await api.put(`/products/${id}`, product);
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};

export default api;