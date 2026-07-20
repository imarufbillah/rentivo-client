import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

interface PlatformStats {
  properties: number;
  renters: number;
  averageRating: number;
  reviews: number;
}

export const useStats = () => {
  return useQuery({
    queryKey: ['stats'],
    queryFn: () => apiClient.get<PlatformStats>('/api/stats'),
    staleTime: 5 * 60 * 1000,
  });
};
