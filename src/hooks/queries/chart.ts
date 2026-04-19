import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ChartConfig } from "shared/types/chart";

export const chartKeys = {
  all: ["charts"] as const,
  lists: () => [...chartKeys.all, "list"] as const,
  details: (id: number) => [...chartKeys.all, "detail", id] as const,
};

export const useAllCharts = () =>
  useQuery({
    queryKey: chartKeys.lists(),
    queryFn: () => window.api.getAllCharts(),
  });

export const useChart = (id: number) =>
  useQuery({
    queryKey: chartKeys.details(id),
    queryFn: () => window.api.getChart(id),
    enabled: !!id,
  });

export const useCreateChart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      chartInfo,
      config,
    }: {
      chartInfo: { name: string; description?: string; dataTableId?: number };
      config: ChartConfig;
    }) => window.api.uploadChart(chartInfo, config),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chartKeys.lists() });
    },
  });
};

export const useUpdateChart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      chartInfo,
      config,
    }: {
      id: number;
      chartInfo: { name?: string; description?: string; dataTableId?: number };
      config: ChartConfig;
    }) => window.api.updateChart(id, chartInfo, config),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: chartKeys.lists() });
      queryClient.invalidateQueries({ queryKey: chartKeys.details(id) });
    },
  });
};

export const useDeleteChart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => window.api.deleteChart(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chartKeys.lists() });
    },
  });
};