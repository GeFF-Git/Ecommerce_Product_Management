import { useState, useEffect, useCallback } from 'react';
import type { LoadingState } from '@/types';

interface UseApiOptions<T> {
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
}

export function useApi<T>(
  apiCall: () => Promise<T>,
  options: UseApiOptions<T> = {}
) {
  const { immediate = true, onSuccess, onError } = options;
  
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<LoadingState>({ 
    isLoading: false, 
    error: null 
  });

  const execute = useCallback(async () => {
    try {
      setLoading({ isLoading: true, error: null });
      const result = await apiCall();
      setData(result);
      onSuccess?.(result);
      setLoading({ isLoading: false, error: null });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setLoading({ isLoading: false, error: errorMessage });
      onError?.(errorMessage);
      throw error;
    }
  }, [apiCall, onSuccess, onError]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  const reset = useCallback(() => {
    setData(null);
    setLoading({ isLoading: false, error: null });
  }, []);

  return {
    data,
    loading: loading.isLoading,
    error: loading.error,
    execute,
    reset,
  };
}

export function useMutation<T, P = any>(
  mutationFn: (params: P) => Promise<T>,
  options: UseApiOptions<T> = {}
) {
  const { onSuccess, onError } = options;
  
  const [loading, setLoading] = useState<LoadingState>({ 
    isLoading: false, 
    error: null 
  });

  const mutate = useCallback(async (params: P) => {
    try {
      setLoading({ isLoading: true, error: null });
      const result = await mutationFn(params);
      onSuccess?.(result);
      setLoading({ isLoading: false, error: null });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setLoading({ isLoading: false, error: errorMessage });
      onError?.(errorMessage);
      throw error;
    }
  }, [mutationFn, onSuccess, onError]);

  return {
    mutate,
    loading: loading.isLoading,
    error: loading.error,
  };
}