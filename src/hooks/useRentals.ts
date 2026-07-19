import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { Rental } from '@/../../rentivo-server/src/types';

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
    queryFn: () => apiClient.get<{ rentals: Rental[] }>('/api/rentals/my'),
  });
};
