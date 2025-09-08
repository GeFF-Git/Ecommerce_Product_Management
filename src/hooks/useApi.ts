import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ApiError } from '@/types';
import { addNotification } from '@/store/signals';

// Generic API hook for queries
export function useApiQuery<TData = unknown, TError = ApiError>(
  queryKey: string[],
  queryFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey,
    queryFn,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors
      if ((error as ApiError)?.status >= 400 && (error as ApiError)?.status < 500) {
        return false;
      }
      return failureCount < 3;
    },
    onError: (error: TError) => {
      const apiError = error as ApiError;
      addNotification({
        type: 'error',
        title: 'Error',
        message: apiError.message || 'An unexpected error occurred',
        read: false,
      });
    },
    ...options,
  });
}

// Generic API hook for mutations
export function useApiMutation<TData = unknown, TVariables = unknown, TError = ApiError>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: UseMutationOptions<TData, TError, TVariables>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onError: (error: TError) => {
      const apiError = error as ApiError;
      addNotification({
        type: 'error',
        title: 'Error',
        message: apiError.message || 'An unexpected error occurred',
        read: false,
      });
    },
    onSuccess: (data, variables, context) => {
      // Invalidate and refetch queries
      queryClient.invalidateQueries();
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
}

// Custom hook for handling loading states
export function useLoadingState(initialState = false) {
  const [loading, setLoading] = useState(initialState);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async <T>(asyncFn: () => Promise<T>): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await asyncFn();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
  }, []);

  return {
    loading,
    error,
    execute,
    reset,
  };
}

// Custom hook for debounced API calls
export function useDebouncedApi<T>(
  apiCall: (query: string) => Promise<T>,
  delay = 300
) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiCall(query);
        setResults(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMessage);
        setResults(null);
      } finally {
        setLoading(false);
      }
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [query, apiCall, delay]);

  return {
    query,
    setQuery,
    results,
    loading,
    error,
  };
}

// Custom hook for optimistic updates
export function useOptimisticUpdate<T>(
  queryKey: string[],
  updateFn: (oldData: T | undefined, newData: Partial<T>) => T
) {
  const queryClient = useQueryClient();

  const optimisticUpdate = useCallback(
    (newData: Partial<T>) => {
      queryClient.setQueryData<T>(queryKey, (oldData) => updateFn(oldData, newData));
    },
    [queryClient, queryKey, updateFn]
  );

  const revert = useCallback(() => {
    queryClient.invalidateQueries(queryKey);
  }, [queryClient, queryKey]);

  return {
    optimisticUpdate,
    revert,
  };
}

// Custom hook for infinite queries
export function useInfiniteApi<TData>(
  queryKey: string[],
  queryFn: ({ pageParam }: { pageParam: number }) => Promise<{
    data: TData[];
    nextPage?: number;
    hasMore: boolean;
  }>,
  options?: any
) {
  return useQuery({
    queryKey,
    queryFn: async () => {
      const result = await queryFn({ pageParam: 1 });
      return result;
    },
    ...options,
  });
}

// Custom hook for real-time data
export function useRealTimeData<T>(
  queryKey: string[],
  initialData: T,
  websocketUrl?: string
) {
  const [data, setData] = useState<T>(initialData);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!websocketUrl) return;

    const ws = new WebSocket(websocketUrl);

    ws.onopen = () => {
      setConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const newData = JSON.parse(event.data);
        setData(newData);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    ws.onclose = () => {
      setConnected(false);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnected(false);
    };

    return () => {
      ws.close();
    };
  }, [websocketUrl]);

  return {
    data,
    connected,
  };
}

// Custom hook for batch operations
export function useBatchOperation<T>() {
  const [operations, setOperations] = useState<Array<() => Promise<T>>>([]);
  const [results, setResults] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const addOperation = useCallback((operation: () => Promise<T>) => {
    setOperations(prev => [...prev, operation]);
  }, []);

  const execute = useCallback(async () => {
    if (operations.length === 0) return;

    setLoading(true);
    setProgress(0);
    const batchResults: T[] = [];

    for (let i = 0; i < operations.length; i++) {
      try {
        const result = await operations[i]();
        batchResults.push(result);
      } catch (error) {
        console.error(`Operation ${i + 1} failed:`, error);
      }
      
      setProgress(((i + 1) / operations.length) * 100);
    }

    setResults(batchResults);
    setLoading(false);
    setOperations([]);
  }, [operations]);

  const clear = useCallback(() => {
    setOperations([]);
    setResults([]);
    setProgress(0);
  }, []);

  return {
    addOperation,
    execute,
    clear,
    operations,
    results,
    loading,
    progress,
  };
}