import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { Property, PropertyWithStats, PaginatedResult, PropertyFilters } from '@/../../rentivo-server/src/types';

interface PropertyFiltersParams {
  search?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: string;
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  maxBathrooms?: number;
  amenities?: string;
  minRating?: number;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit?: number;
}

export const useProperties = (filters?: PropertyFiltersParams) => {
  return useQuery({
    queryKey: ['properties', filters],
    queryFn: () => apiClient.get<PaginatedResult<Property>>('/api/properties', filters as Record<string, string | number>),
  });
};

export interface PropertyOwner {
  _id: string;
  name: string;
  avatar?: string;
  bio?: string;
  phone?: string;
  isVerified?: boolean;
  createdAt: string;
}

export const useProperty = (id: string) => {
  return useQuery({
    queryKey: ['properties', id],
    queryFn: () => apiClient.get<{ property: Property; owner: PropertyOwner | null }>(`/api/properties/${id}`),
    enabled: !!id,
  });
};

export const useCreateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Property, '_id' | 'ownerId' | 'createdAt' | 'updatedAt'>) =>
      apiClient.post<{ property: Property }>('/api/properties', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
};

export const useUpdateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<Property, '_id' | 'ownerId' | 'createdAt' | 'updatedAt'>> }) =>
      apiClient.patch<{ property: Property }>(`/api/properties/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
};

export const useDeleteProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/api/properties/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
};

export const useMyProperties = () => {
  return useQuery({
    queryKey: ['properties', 'my'],
    queryFn: () => apiClient.get<{ properties: PropertyWithStats[] }>('/api/properties/my-properties'),
  });
};

export const useRelatedProperties = (location: string, propertyType: string, excludeId: string) => {
  return useQuery({
    queryKey: ['properties', 'related', location, propertyType, excludeId],
    queryFn: async () => {
      const result = await apiClient.get<PaginatedResult<Property>>('/api/properties', {
        location,
        limit: 4,
      });
      return result.data.filter((p) => p._id?.toString() !== excludeId);
    },
    enabled: !!location && !!propertyType && !!excludeId,
  });
};

export const useAmenities = () => {
  return useQuery({
    queryKey: ['properties', 'amenities'],
    queryFn: () => apiClient.get<{ amenities: string[] }>('/api/properties/amenities'),
  });
};
