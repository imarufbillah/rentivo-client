import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { authClient } from '@/lib/auth-client';
import { User } from '@/../../rentivo-server/src/types';

export const useSession = () => {
  return useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const result = await authClient.getSession();
      if (result.error) {
        return null;
      }
      return result.data;
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const result = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });
      if (result.error) {
        throw new Error(result.error.message || 'Login failed');
      }
      return result.data;
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
      const result = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.name || "",
      });
      if (result.error) {
        throw new Error(result.error.message || 'Registration failed');
      }
      return result.data;
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
