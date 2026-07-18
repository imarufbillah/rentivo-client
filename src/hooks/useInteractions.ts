import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { Property } from '@/../../rentivo-server/src/types';

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
