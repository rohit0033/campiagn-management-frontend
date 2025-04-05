import { useState } from "react";
import { ApiError } from "@/types";
import { api } from "@/services/api";

interface ApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: ApiError | null;
}

// Generic hook for API calls
export function useApi<T, P extends unknown[]>(
  apiFunction: (...args: P) => Promise<T>
) {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const execute = async (...args: P) => {
    setState({ data: null, isLoading: true, error: null });
    
    try {
      const result = await apiFunction(...args);
      setState({ data: result, isLoading: false, error: null });
      return result;
    } catch (error) {
      const apiError: ApiError = {
        message: error.response?.data?.message || error.message || "An unknown error occurred",
        status: error.response?.status
      };
      setState({ data: null, isLoading: false, error: apiError });
      throw apiError;
    }
  };

  return {
    ...state,
    execute,
  };
}