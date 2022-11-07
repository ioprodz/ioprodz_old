import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "./api";

export const useGithubAuthQuery = (authCode: string) =>
  useQuery({
    queryKey: ["auth"],
    queryFn: () => apiClient.get(`/auth/github/callback?code=${authCode}`),
    enabled: !!authCode,
    onSuccess: () => {
      window.location.pathname = "/";
    },
  });

interface Profile {
  name: string;
  avatarUrl: string;
}
export const useMyProfileQuery = () =>
  useQuery<Profile, { status: number }>({
    queryKey: ["profiles"],
    queryFn: () => apiClient.get("/profile/me"),
    onError: (err) => {
      if (
        window.location.pathname !== "/" &&
        window.location.pathname !== "/auth" &&
        err.status === 401
      ) {
        window.location.pathname = "/auth";
      }
      return null;
    },
  });

export interface Subscription {
  email: string;
  source?: string;
}
export const useAddSubsciptionMutation = () =>
  useMutation<unknown, { status: number }, Subscription>({
    mutationFn: (data: Subscription) => apiClient.post("/subscription", data),
  });
