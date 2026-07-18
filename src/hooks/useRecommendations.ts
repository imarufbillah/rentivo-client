import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { RecommendedProperty } from '@/../../rentivo-server/src/types';

interface RecommendationResponse {
  recommendations: RecommendedProperty[];
  isPersonalized: boolean;
}

interface RecommendationFilters {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: string;
}

export const useRecommendations = (filters?: RecommendationFilters) => {
  return useQuery({
    queryKey: ['recommendations', filters],
    queryFn: () => apiClient.get<RecommendationResponse>('/api/recommendations', filters as Record<string, string | number>),
    staleTime: 1000 * 60 * 10, // 10 minutes - recommendations change slowly
  });
};
