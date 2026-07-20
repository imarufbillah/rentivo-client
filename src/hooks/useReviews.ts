import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { Review } from '@/types';

interface ReviewResponse {
  reviews: Review[];
  averageRating: number | null;
  totalReviews: number;
}

export const useReviews = (propertyId: string) => {
  return useQuery({
    queryKey: ['reviews', propertyId],
    queryFn: () => apiClient.get<ReviewResponse>(`/api/reviews/property/${propertyId}`),
    enabled: !!propertyId,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { propertyId: string; rating: number; comment: string }) =>
      apiClient.post<{ review: Review }>('/api/reviews', data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.propertyId] });
      queryClient.invalidateQueries({ queryKey: ['properties', variables.propertyId] });
    },
  });
};

interface ReviewWithUser extends Review {
  userName?: string;
  userAvatar?: string;
  propertyTitle?: string;
  propertyLocation?: string;
}

export const useRecentReviews = () => {
  return useQuery({
    queryKey: ['reviews', 'recent'],
    queryFn: () => apiClient.get<{ reviews: ReviewWithUser[] }>('/api/reviews/recent'),
    staleTime: 5 * 60 * 1000,
  });
};
