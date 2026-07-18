import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { signIn, signUp } from '@/lib/auth-client';
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
    mutationFn: async (data: { email: string; password: string }) => {
      const result = await signIn.email({
        email: data.email,
        password: data.password,
      });
      if (result.error) {
        throw new Error(result.error?.message || 'Login failed');
      }
      const sessionData = await apiClient.get<SessionResponse>('/api/auth/session');
      return sessionData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session'] });
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { email: string; password: string; name?: string }) => {
      const result = await signUp.email({
        email: data.email,
        password: data.password,
        name: data.name || "",
      });
      if (result.error) {
        throw new Error(result.error?.message || 'Registration failed');
      }
      const sessionData = await apiClient.get<SessionResponse>('/api/auth/session');
      return sessionData;
    },
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
