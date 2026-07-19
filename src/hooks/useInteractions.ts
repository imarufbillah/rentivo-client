import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { Property } from '@/../../rentivo-server/src/types';

interface InteractionHistoryItem {
  _id?: string;
  userId: string;
  propertyId: string;
  type: 'view' | 'save' | 'dismiss';
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

export const useTrackInteraction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { propertyId: string; type: 'view' | 'save' | 'dismiss' }) =>
      apiClient.post('/api/interactions', data),
    onSuccess: (_, variables) => {
      if (variables.type === 'save' || variables.type === 'dismiss') {
        queryClient.invalidateQueries({ queryKey: ['recommendations'] });
      }
      queryClient.invalidateQueries({ queryKey: ['interactions'] });
    },
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
    mutationFn: (data: { propertyId: string; type: 'view' | 'save' | 'dismiss' }) =>
      apiClient.delete('/api/interactions', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interactions'] });
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
    },
  });
};
