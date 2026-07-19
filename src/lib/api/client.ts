import { authClient } from "@/lib/auth-client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const getToken = async (): Promise<string | null> => {
  try {
    const { data, error } = await authClient.token();
    if (error || !data) return null;
    return data.token;
  } catch {
    return null;
  }
};

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await getToken();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.error?.code || "UNKNOWN_ERROR",
        data.error?.message || "An unexpected error occurred",
        response.status
      );
    }

    return data.data ?? data;
  }

  async get<T>(
    endpoint: string,
    params?: Record<string, string | number | undefined>
  ): Promise<T> {
    const filteredParams = Object.fromEntries(
      Object.entries(params || {}).filter(
        ([, v]) => v !== undefined && v !== ""
      )
    );
    const query = Object.keys(filteredParams).length
      ? `?${new URLSearchParams(
          filteredParams as Record<string, string>
        ).toString()}`
      : "";
    return this.request<T>(`${endpoint}${query}`, { method: "GET" });
  }

  async post<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async patch<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "DELETE",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  stream(endpoint: string, body?: unknown): ReadableStream {
    const controller = new AbortController();

    (async () => {
      const token = await getToken();
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers,
        body: body ? JSON.stringify(body) : undefined,
        credentials: "include",
        signal: controller.signal,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new ApiError(
          data.error?.code || "UNKNOWN_ERROR",
          data.error?.message || "Stream failed",
          response.status
        );
      }
    })();

    return new ReadableStream({
      cancel: () => controller.abort(),
    });
  }
}

export const apiClient = new ApiClient();
