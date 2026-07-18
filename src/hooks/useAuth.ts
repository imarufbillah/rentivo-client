import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { User } from '@/../../rentivo-server/src/types';

interface SessionResponse {
  user: User;
}

export const useSession = () => {
  return useQuery({
    queryKey: ['session'],
    queryFn: () => apiClient.get<SessionResponse>('/api/auth/session'),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      apiClient.post<SessionResponse>('/api/auth/sign-in/email', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session'] });
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { email: string; password: string; name?: string }) =>
      apiClient.post<SessionResponse>('/api/auth/sign-up/email', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session'] });
    },
  });
};

export const useUpgradeToOwner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiClient.patch<{ user: User }>('/api/users/upgrade-to-owner'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session'] });
    },
  });
};
