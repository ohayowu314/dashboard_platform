import { useEffect, useState } from "react";
import {
  Box,
  TextField,
  FormControlLabel,
  Switch,
  Typography,
  Autocomplete,
  FormGroup,
  FormControl,
  FormLabel,
  Checkbox,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import type { TableBlockConfig } from "shared/types/dashboard";
import type { DataTableInfo } from "shared/types/dataTable";

interface TableBlockEditorProps {
  config: TableBlockConfig;
  onSave: (config: TableBlockConfig) => void;
  onCancel: () => void;
}

export const TableBlockEditor = ({
  config,
  onSave,
  onCancel,
}: TableBlockEditorProps) => {
  const [localConfig, setLocalConfig] = useState<TableBlockConfig>(config);
  const [tables, setTables] = useState<DataTableInfo[]>([]);
  const [tableHeaders, setTableHeaders] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingHeaders, setLoadingHeaders] = useState(false);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const result = await window.api.getAllTableInfos();
        setTables(result);
      } catch (e) {
        console.error("Failed to fetch tables:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchTables();
  }, []);

  useEffect(() => {
    const fetchHeaders = async () => {
      if (!localConfig.dataTableId) {
        setTableHeaders([]);
        return;
      }

      setLoadingHeaders(true);
      try {
        const result = await window.api.getTable(localConfig.dataTableId);
        setTableHeaders(result.data.headers);
        // Reset columns if they don't exist in new table
        const newColumns = localConfig.columns?.filter((col) =>
          result.data.headers.includes(col)
        );
        if (newColumns && newColumns.length > 0) {
          setLocalConfig((prev) => ({ ...prev, columns: newColumns }));
        } else {
          setLocalConfig((prev) => ({ ...prev, columns: undefined }));
        }
      } catch (e) {
        console.error("Failed to fetch table:", e);
        setTableHeaders([]);
      } finally {
        setLoadingHeaders(false);
      }
    };

    fetchHeaders();
  }, [localConfig.dataTableId, localConfig.columns]);

  const handleSave = () => {
    onSave(localConfig);
  };

  const selectedTable = tables.find((t) => t.id === localConfig.dataTableId);

  const handleColumnToggle = (header: string) => {
    const currentColumns = localConfig.columns || [];
    if (currentColumns.includes(header)) {
      setLocalConfig((prev) => ({
        ...prev,
        columns: prev.columns?.filter((c) => c !== header),
      }));
    } else {
      setLocalConfig((prev) => ({
        ...prev,
        columns: [...(prev.columns || []), header],
      }));
    }
  };

  const handleSelectAll = () => {
    setLocalConfig((prev) => ({
      ...prev,
      columns: [...tableHeaders],
    }));
  };

  const handleClearAll = () => {
    setLocalConfig((prev) => ({
      ...prev,
      columns: [],
    }));
  };

  return (
    <Box sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column", overflow: "auto" }}>
      {/* 標題列 */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: "bold" }} >
          編輯表格區塊
        </Typography>
        <Box>
          <IconButton size="small" onClick={onCancel} sx={{ mr: 1 }}>
            <CloseIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={handleSave} color="primary">
            <CheckIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress size={24} />
        </Box>
      ) : (
        <>
          {/* 選擇資料表 */}
          <Autocomplete
            options={tables}
            getOptionLabel={(option) => option.name}
            value={selectedTable || null}
            onChange={(_, newValue) => {
              setLocalConfig((prev) => ({
                ...prev,
                dataTableId: newValue?.id || 0,
                columns: undefined,
              }));
            }}
            renderInput={(params) => (
              <TextField {...params} label="選擇資料表" size="small" sx={{ mb: 2 }} />
            )}
            renderOption={(props, option) => (
              <Box component="li" {...props}>
                <Box>
                  <Typography variant="body2">{option.name}</Typography>
                  {option.description && (
                    <Typography variant="caption" color="text.secondary">
                      {option.description}
                    </Typography>
                  )}
                </Box>
              </Box>
            )}
          />

          {/* 欄位選擇 */}
          {localConfig.dataTableId > 0 && (
            <FormControl component="fieldset" sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <FormLabel component="legend">
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    顯示欄位
                  </Typography>
                </FormLabel>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{ cursor: "pointer", mr: 1, color: "primary.main" }}
                    onClick={handleSelectAll}
                  >
                    全選
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ cursor: "pointer", color: "primary.main" }}
                    onClick={handleClearAll}
                  >
                    清除
                  </Typography>
                </Box>
              </Box>
              {loadingHeaders ? (
                <CircularProgress size={20} />
              ) : (
                <FormGroup sx={{ maxHeight: 150, overflow: "auto" }}>
                  {tableHeaders.map((header) => (
                    <FormControlLabel
                      key={header}
                      control={
                        <Checkbox
                          size="small"
                          checked={(localConfig.columns || tableHeaders).includes(header)}
                          onChange={() => handleColumnToggle(header)}
                        />
                      }
                      label={<Typography variant="body2">{header}</Typography>}
                    />
                  ))}
                </FormGroup>
              )}
            </FormControl>
          )}

          {/* 每頁筆數 */}
          <TextField
            label="每頁筆數"
            type="number"
            fullWidth
            size="small"
            value={localConfig.pageSize || 10}
            onChange={(e) =>
              setLocalConfig((prev) => ({
                ...prev,
                pageSize: Math.max(1, Number(e.target.value)),
              }))
            }
            slotProps={{
              htmlInput: {
                min: 1
              }
            }}
            sx={{ mb: 2 }}
          />

          {/* 選項 */}
          <Typography variant="body2" sx={{ mb: 1, fontWeight: "bold" }}>
            選項
          </Typography>

          <FormControlLabel
            control={
              <Switch
                checked={localConfig.sortable ?? true}
                onChange={(e) =>
                  setLocalConfig((prev) => ({ ...prev, sortable: e.target.checked }))
                }
                size="small"
              />
            }
            label="啟用排序"
            sx={{ mb: 1 }}
          />

          <FormControlLabel
            control={
              <Switch
                checked={localConfig.filterable ?? false}
                onChange={(e) =>
                  setLocalConfig((prev) => ({ ...prev, filterable: e.target.checked }))
                }
                size="small"
              />
            }
            label="啟用過濾"
          />
        </>
      )}
    </Box>
  );
};

export default TableBlockEditor;