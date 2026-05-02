import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const SYSTEM_CONFIG_KEYS = {
  DEFAULT_DASHBOARD_ID: "defaultDashboardId",
} as const;

export const useSystemConfig = (key: string) => {
  return useQuery({
    queryKey: ["systemConfig", key],
    queryFn: async () => {
      const value = await window.api.getSystemConfig(key);
      return value ?? null;
    },
  });
};

export const useSetSystemConfig = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) =>
      window.api.setSystemConfig(key, value),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["systemConfig", variables.key] });
    },
  });
};
