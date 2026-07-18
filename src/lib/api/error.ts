import { ApiError } from "./client";

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred";
};

export const isAuthError = (error: unknown): boolean => {
  return (
    error instanceof ApiError &&
    ["UNAUTHORIZED", "SESSION_EXPIRED"].includes(error.code)
  );
};

export const isLLMServiceError = (error: unknown): boolean => {
  return (
    error instanceof ApiError && error.code === "LLM_SERVICE_UNAVAILABLE"
  );
};

export const getErrorDisplayTitle = (error: unknown): string => {
  if (error instanceof ApiError) {
    switch (error.code) {
      case "UNAUTHORIZED":
      case "SESSION_EXPIRED":
        return "Session Expired";
      case "INSUFFICIENT_ROLE":
        return "Access Denied";
      case "RESOURCE_NOT_FOUND":
        return "Not Found";
      case "VALIDATION_FAILED":
        return "Invalid Input";
      case "LLM_SERVICE_UNAVAILABLE":
        return "AI Service Unavailable";
      case "DATABASE_ERROR":
        return "Service Unavailable";
      default:
        return "Something Went Wrong";
    }
  }

  return "Something Went Wrong";
};
