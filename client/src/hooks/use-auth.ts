import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { fetchWithAuth } from "@/lib/auth-client";
import { z } from "zod";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export function useAuth() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: [api.auth.me.path],
    queryFn: async () => {
      if (!localStorage.getItem('token')) return null;
      const res = await fetchWithAuth(api.auth.me.path);
      if (!res.ok) return null;
      return api.auth.me.responses[200].parse(await res.json());
    },
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: async (data: z.infer<typeof api.auth.login.input>) => {
      const res = await fetch(api.auth.login.path, {
        method: api.auth.login.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Login failed');
      }
      return api.auth.login.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      queryClient.setQueryData([api.auth.me.path], data.user);
      toast({ title: "Welcome back!", description: "Successfully logged in." });
      setLocation('/');
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: z.infer<typeof api.auth.register.input>) => {
      const res = await fetch(api.auth.register.path, {
        method: api.auth.register.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Registration failed');
      }
      return api.auth.register.responses[201].parse(await res.json());
    },
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      queryClient.setQueryData([api.auth.me.path], data.user);
      toast({ title: "Account created!", description: "Welcome to PoultryCare." });
      setLocation('/');
    },
  });

  const logout = () => {
    localStorage.removeItem('token');
    queryClient.setQueryData([api.auth.me.path], null);
    setLocation('/auth');
  };

  return {
    user,
    isLoading,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    logout,
  };
}
