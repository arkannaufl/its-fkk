/**
 * Utility function to extract error message from various error types
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (error && typeof error === 'object') {
    // Handle axios error response
    if ('response' in error) {
      const axiosError = error as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
      if (axiosError.response?.data?.message) {
        return axiosError.response.data.message;
      }
      // Handle validation errors
      if (axiosError.response?.data?.errors) {
        const firstError = Object.values(axiosError.response.data.errors)[0];
        if (Array.isArray(firstError) && firstError.length > 0) {
          return firstError[0];
        }
      }
    }

    // Handle error with message property
    if ('message' in error && typeof error.message === 'string') {
      return error.message;
    }
  }

  return 'Terjadi kesalahan';
};

/**
 * Format validation errors from API response
 */
export const formatValidationErrors = (
  errors: Record<string, string | string[]>
): Record<string, string> => {
  const formattedErrors: Record<string, string> = {};
  Object.keys(errors).forEach((key) => {
    formattedErrors[key] = Array.isArray(errors[key])
      ? errors[key][0]
      : errors[key];
  });
  return formattedErrors;
};

