import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useProperties, useCreateProperty, useDeleteProperty } from '@/hooks/useProperties';
import { useTrackInteraction, useSavedProperties } from '@/hooks/useInteractions';
import { useReviews, useCreateReview } from '@/hooks/useReviews';
import { useRecommendations } from '@/hooks/useRecommendations';
import { useSession, useUpgradeToOwner } from '@/hooks/useAuth';
import { apiClient } from '@/lib/api';

vi.mock('@/lib/api', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
  ApiError: class ApiError extends Error {
    constructor(public code: string, message: string, public status: number) {
      super(message);
    }
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('useProperties', () => {
  it('fetches properties with filters', async () => {
    const mockData = { data: [], pagination: { page: 1, limit: 12, total: 0, totalPages: 0 } };
    vi.mocked(apiClient.get).mockResolvedValue(mockData);

    const { result } = renderHook(() => useProperties({ location: 'New York' }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(apiClient.get).toHaveBeenCalledWith('/api/properties', { location: 'New York' });
  });
});

describe('useCreateProperty', () => {
  it('invalidates properties cache after creation', async () => {
    const mockData = { property: { _id: '1', title: 'New Property' } };
    vi.mocked(apiClient.post).mockResolvedValue(mockData);

    const { result } = renderHook(() => useCreateProperty(), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync({
      title: 'New Property',
      description: 'A test property',
      price: 1000,
      location: 'New York',
      propertyType: 'apartment',
      images: ['https://example.com/img.jpg'],
    });

    expect(apiClient.post).toHaveBeenCalled();
  });
});

describe('useDeleteProperty', () => {
  it('calls delete endpoint', async () => {
    vi.mocked(apiClient.delete).mockResolvedValue({});

    const { result } = renderHook(() => useDeleteProperty(), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync('123');

    expect(apiClient.delete).toHaveBeenCalledWith('/api/properties/123');
  });
});

describe('useTrackInteraction', () => {
  it('tracks interaction', async () => {
    vi.mocked(apiClient.post).mockResolvedValue({ interaction: {} });

    const { result } = renderHook(() => useTrackInteraction(), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync({ propertyId: '123', type: 'view' });

    expect(apiClient.post).toHaveBeenCalledWith('/api/interactions', {
      propertyId: '123',
      type: 'view',
    });
  });
});

describe('useReviews', () => {
  it('fetches reviews for a property', async () => {
    const mockData = { reviews: [], averageRating: null, totalReviews: 0 };
    vi.mocked(apiClient.get).mockResolvedValue(mockData);

    const { result } = renderHook(() => useReviews('123'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(apiClient.get).toHaveBeenCalledWith('/api/reviews/property/123');
  });

  it('does not fetch when propertyId is empty', () => {
    const { result } = renderHook(() => useReviews(''), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe('idle');
    expect(apiClient.get).not.toHaveBeenCalled();
  });
});

describe('useRecommendations', () => {
  it('fetches recommendations with filters', async () => {
    const mockData = { recommendations: [], isPersonalized: false };
    vi.mocked(apiClient.get).mockResolvedValue(mockData);

    const { result } = renderHook(() => useRecommendations({ location: 'NYC' }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(apiClient.get).toHaveBeenCalledWith('/api/recommendations', { location: 'NYC' });
  });
});

describe('useSession', () => {
  it('fetches session', async () => {
    const mockData = { user: { id: '1', email: 'test@test.com', role: 'renter' } };
    vi.mocked(apiClient.get).mockResolvedValue(mockData);

    const { result } = renderHook(() => useSession(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(apiClient.get).toHaveBeenCalledWith('/api/auth/session');
  });
});

describe('useUpgradeToOwner', () => {
  it('calls upgrade endpoint', async () => {
    vi.mocked(apiClient.patch).mockResolvedValue({ user: { role: 'owner' } });

    const { result } = renderHook(() => useUpgradeToOwner(), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync();

    expect(apiClient.patch).toHaveBeenCalledWith('/api/users/upgrade-to-owner');
  });
});
