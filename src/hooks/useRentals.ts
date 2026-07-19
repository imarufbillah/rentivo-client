import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { Rental, RentalWithProperty } from '@/../../rentivo-server/src/types';

interface CheckoutResult {
  checkoutUrl: string;
  rentalId: string;
}

interface RentalStatusResult {
  isRented: boolean;
  rental: Rental | null;
}

export const useCreateCheckout = () => {
  return useMutation({
    mutationFn: (propertyId: string) =>
      apiClient.post<CheckoutResult>('/api/rentals/checkout', { propertyId }),
  });
};

export const usePropertyRentalStatus = (propertyId: string) => {
  return useQuery({
    queryKey: ['rental-status', propertyId],
    queryFn: () => apiClient.get<RentalStatusResult>(`/api/rentals/property/${propertyId}`),
    enabled: !!propertyId,
  });
};

export const useMyRentals = () => {
  return useQuery({
    queryKey: ['rentals', 'my'],
    queryFn: () => apiClient.get<{ rentals: RentalWithProperty[] }>('/api/rentals/my'),
  });
};

export const useConfirmRental = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string) =>
      apiClient.post<{ confirmed: boolean; rental: Rental | null }>('/api/rentals/confirm', { sessionId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['rental-status'] });
    },
  });
};

export const useCancelPendingRental = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (propertyId: string) =>
      apiClient.post<{ cancelled: boolean }>('/api/rentals/cancel', { propertyId }),
    onSuccess: (_, propertyId) => {
      queryClient.invalidateQueries({ queryKey: ['rental-status', propertyId] });
    },
  });
};
