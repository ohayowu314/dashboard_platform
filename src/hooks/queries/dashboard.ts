import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { DashboardConfig } from "shared/types/dashboard";

export const dashboardKeys = {
  all: ["dashboards"] as const,
  lists: () => [...dashboardKeys.all, "list"] as const,
  details: (id: number) => [...dashboardKeys.all, "detail", id] as const,
};

export const useAllDashboards = () =>
  useQuery({
    queryKey: dashboardKeys.lists(),
    queryFn: () => window.api.getAllDashboards(),
  });

export const useDashboard = (id: number) =>
  useQuery({
    queryKey: dashboardKeys.details(id),
    queryFn: () => window.api.getDashboard(id),
    enabled: !!id,
  });

export const useCreateDashboard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      title,
      description,
      config,
    }: {
      title: string;
      description?: string;
      config: DashboardConfig;
    }) => window.api.createDashboard(title, description, config),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.lists() });
    },
  });
};

export const useUpdateDashboard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      title,
      description,
      config,
    }: {
      id: number;
      title: string;
      description?: string;
      config: DashboardConfig;
    }) => window.api.updateDashboard(id, title, description, config),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.lists() });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.details(id) });
    },
  });
};

export const useDeleteDashboard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => window.api.deleteDashboard(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.lists() });
    },
  });
};