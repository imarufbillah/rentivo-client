import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { Property } from '@/../../rentivo-server/src/types';

interface InteractionHistoryItem {
  _id?: string;
  userId: string;
  propertyId: string;
  type: 'view' | 'save';
  createdAt: string;
  property: Property | null;
}

interface InteractionHistoryResponse {
  interactions: InteractionHistoryItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface InteractionState {
  hasViewed: boolean;
  hasSaved: boolean;
}

export const useTrackInteraction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { propertyId: string; type: 'view' | 'save' }) =>
      apiClient.post('/api/interactions', data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['interactions', 'state', variables.propertyId] });
      if (variables.type === 'save') {
        queryClient.invalidateQueries({ queryKey: ['recommendations'] });
      }
      queryClient.invalidateQueries({ queryKey: ['interactions'] });
    },
  });
};

export const useInteractionState = (propertyId: string) => {
  return useQuery({
    queryKey: ['interactions', 'state', propertyId],
    queryFn: () => apiClient.get<InteractionState>(`/api/interactions/property/${propertyId}`),
    enabled: !!propertyId,
  });
};

export const useSavedProperties = () => {
  return useQuery({
    queryKey: ['interactions', 'saved'],
    queryFn: () => apiClient.get<{ properties: Property[] }>('/api/interactions/saved-properties'),
  });
};

export const useInteractionHistory = (type?: string, page: number = 1) => {
  return useQuery({
    queryKey: ['interactions', 'history', type, page],
    queryFn: () => {
      const params: Record<string, string | number> = { page, limit: 12 };
      if (type && type !== 'all') {
        params.type = type;
      }
      return apiClient.get<InteractionHistoryResponse>('/api/interactions', params);
    },
  });
};

export const useDeleteInteraction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { propertyId: string; type: 'view' | 'save' }) =>
      apiClient.delete('/api/interactions', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interactions'] });
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
    },
  });
};
