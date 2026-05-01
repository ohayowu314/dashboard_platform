import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { DataTableHeaderSchema } from "shared/types/dataTable";
import type { UploadMode } from "shared/types/index";

export const dataTableKeys = {
  all: ["dataTables"] as const,
  lists: () => [...dataTableKeys.all, "list"] as const,
  details: (id: number) => [...dataTableKeys.all, "detail", id] as const,
};

export const useAllTableInfos = () =>
  useQuery({
    queryKey: dataTableKeys.lists(),
    queryFn: () => window.api.getAllTableInfos(),
  });

export const useTable = (
  id: number,
  options?: { enabled?: boolean }
) =>
  useQuery({
    queryKey: dataTableKeys.details(id),
    queryFn: () => window.api.getTable(id),
    enabled: options?.enabled ?? !!id,
  });

export const useUploadTable = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      tableInfo,
      content,
      mode = "create",
    }: {
      tableInfo: { name: string; description?: string };
      content: DataTableHeaderSchema;
      mode?: UploadMode;
    }) => window.api.uploadTable(tableInfo, content, mode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dataTableKeys.lists() });
    },
  });
};

export const useUpdateDataTable = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      name,
      data,
    }: {
      id: number;
      name: string;
      data: DataTableHeaderSchema;
    }) => window.api.updateTable(id, name, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: dataTableKeys.lists() });
      queryClient.invalidateQueries({ queryKey: dataTableKeys.details(id) });
    },
  });
};

export const useDeleteDataTable = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => window.api.deleteTable(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dataTableKeys.lists() });
    },
  });
};

export const useCheckTablesConflict = () => {
  return useMutation({
    mutationFn: (names: string[]) => window.api.checkTablesConflict(names),
  });
};