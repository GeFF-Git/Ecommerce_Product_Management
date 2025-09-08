import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import type { 
  Category, 
  Product, 
  CreateCategoryDto, 
  CreateProductDto, 
  UpdateCategoryDto, 
  UpdateProductDto,
  CreateCategoryAttributeDto,
  UpdateCategoryAttributeDto,
  CreateProductAttributeValueDto,
  UpdateProductAttributeValueDto,
  ApiError
} from '@/types';
import { API_CONFIG } from '@/constants';
import { addNotification } from '@/store/signals';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const apiError: ApiError = {
      message: error.message || 'An unexpected error occurred',
      status: error.response?.status || 500,
      code: error.code,
    };

    // Handle specific error cases
    if (error.response?.status === 401) {
      // Handle unauthorized access
      addNotification({
        type: 'error',
        title: 'Authentication Error',
        message: 'Your session has expired. Please log in again.',
        read: false,
      });
    } else if (error.response?.status === 403) {
      addNotification({
        type: 'error',
        title: 'Access Denied',
        message: 'You do not have permission to perform this action.',
        read: false,
      });
    } else if (error.response?.status >= 500) {
      addNotification({
        type: 'error',
        title: 'Server Error',
        message: 'A server error occurred. Please try again later.',
        read: false,
      });
    }

    return Promise.reject(apiError);
  }
);

// Retry logic for failed requests
const retryRequest = async (fn: () => Promise<any>, retries = API_CONFIG.RETRY_ATTEMPTS): Promise<any> => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0 && (error as ApiError).status >= 500) {
      await new Promise(resolve => setTimeout(resolve, API_CONFIG.RETRY_DELAY));
      return retryRequest(fn, retries - 1);
    }
    throw error;
  }
};

// Category API
export const categoryApi = {
  getAll: async (): Promise<Category[]> => {
    return retryRequest(async () => {
      const response = await api.get<Category[]>('/categories');
      return response.data;
    });
  },

  getById: async (id: number): Promise<Category> => {
    return retryRequest(async () => {
      const response = await api.get<Category>(`/categories/${id}`);
      return response.data;
    });
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

  addAttribute: async (categoryId: number, attribute: CreateCategoryAttributeDto): Promise<void> => {
    await api.post(`/categories/${categoryId}/attributes`, attribute);
  },

  updateAttribute: async (attributeId: number, attribute: UpdateCategoryAttributeDto): Promise<void> => {
    await api.put(`/categories/attributes/${attributeId}`, attribute);
  },

  deleteAttribute: async (attributeId: number): Promise<void> => {
    await api.delete(`/categories/attributes/${attributeId}`);
  },
};

// Product API
export const productApi = {
  getAll: async (): Promise<Product[]> => {
    return retryRequest(async () => {
      const response = await api.get<Product[]>('/products');
      return response.data;
    });
  },

  getById: async (id: number): Promise<Product> => {
    return retryRequest(async () => {
      const response = await api.get<Product>(`/products/${id}`);
      return response.data;
    });
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

  addAttribute: async (productId: number, attribute: CreateProductAttributeValueDto): Promise<void> => {
    await api.post(`/products/${productId}/attributes`, attribute);
  },

  updateAttribute: async (
    productId: number, 
    attributeId: number, 
    attribute: UpdateProductAttributeValueDto
  ): Promise<void> => {
    await api.put(`/products/${productId}/attributes/${attributeId}`, attribute);
  },

  deleteAttribute: async (productId: number, attributeId: number): Promise<void> => {
    await api.delete(`/products/${productId}/attributes/${attributeId}`);
  },
};

// Utility functions
export const apiUtils = {
  // Check if API is healthy
  healthCheck: async (): Promise<boolean> => {
    try {
      await api.get('/health');
      return true;
    } catch {
      return false;
    }
  },

  // Upload file
  uploadFile: async (file: File, onProgress?: (progress: number) => void): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<{ url: string }>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });

    return response.data.url;
  },

  // Export data
  exportData: async (type: 'products' | 'categories', format: 'csv' | 'excel' = 'csv'): Promise<Blob> => {
    const response = await api.get(`/export/${type}`, {
      params: { format },
      responseType: 'blob',
    });
    return response.data;
  },

  // Import data
  importData: async (
    type: 'products' | 'categories', 
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<{ success: number; errors: string[] }> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<{ success: number; errors: string[] }>(
      `/import/${type}`, 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(progress);
          }
        },
      }
    );

    return response.data;
  },
};

export default api;