import { useMemo } from "react";
import { Box, Fab, Tooltip } from "@mui/material";
import { Responsive, useContainerWidth, type LayoutItem, type ResizeHandleAxis } from "react-grid-layout";
import { DashboardBlockWrapper } from "./DashboardBlockWrapper";
import { BlockRenderer } from "./blocks/BlockRenderer";
import type { DashboardConfig, DashboardBlock } from "shared/types/dashboard";

import AddIcon from "@mui/icons-material/Add";
import "react-grid-layout/css/styles.css";

interface DashboardCanvasProps {
  config: DashboardConfig;
  isEditing?: boolean;
  onBlocksChange?: (blocks: DashboardBlock[]) => void;
  onDeleteBlock?: (blockId: string) => void;
  onEditBlock?: (blockId: string) => void;
  onAddBlock?: () => void;
}

const availableHandles: ResizeHandleAxis[] = ["s", "w", "e", "n", "sw", "nw", "se", "ne"];

export const DashboardCanvas = ({
  config,
  isEditing = false,
  onBlocksChange,
  onDeleteBlock,
  onEditBlock,
  onAddBlock,
}: DashboardCanvasProps) => {
  const { width, containerRef, mounted } = useContainerWidth();
  const { blocks, settings } = config;

  const cols = settings?.columns ?? 12;
  const rowHeight = settings?.rowHeight ?? 50;

  const layout: LayoutItem[] = useMemo(() => {
    return blocks.map((block) => ({
      i: block.id,
      x: block.layout.x,
      y: block.layout.y,
      w: block.layout.w,
      h: block.layout.h,
      minW: block.layout.minW,
      maxW: block.layout.maxW,
      minH: block.layout.minH,
      maxH: block.layout.maxH,
      static: !isEditing,
      resizeHandles: availableHandles,
    }));
  }, [blocks, isEditing]);

  const handleLayoutChange = (newLayout: readonly LayoutItem[]) => {
    if (!onBlocksChange) return;

    const updatedBlocks = blocks.map((block) => {
      const item = newLayout.find((l) => l.i === block.id);
      if (item) {
        return {
          ...block,
          layout: {
            ...block.layout,
            x: item.x,
            y: item.y,
            w: item.w,
            h: item.h,
          },
        };
      }
      return block;
    });

    onBlocksChange(updatedBlocks);
  };

  if (!mounted) {
    return (
      <Box
        ref={containerRef}
        sx={{ minHeight: 400, backgroundColor: "#f5f5f5", borderRadius: 1 }}
      />
    );
  }

  return (
    <Box ref={containerRef}>
      <Responsive
        layouts={{ lg: layout }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: cols, md: cols, sm: cols, xs: cols, xxs: cols }}
        rowHeight={rowHeight}
        width={width}
        margin={[12, 12]}
        containerPadding={[12, 12]}
        onLayoutChange={(newLayout) => handleLayoutChange(newLayout)}
        dragConfig={{ enabled: isEditing, handle: ".drag-handle" }}
        resizeConfig={{ enabled: isEditing }}
      >
        {blocks.map((block) => (
          <Box
            key={block.id}
            className="drag-handle"
            sx={{
              height: "100%",
              backgroundColor: "#fff",
              borderRadius: 1,
              boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
              overflow: "hidden",
            }}
          >
            <DashboardBlockWrapper
              block={block}
              isEditing={isEditing}
              onDelete={() => onDeleteBlock?.(block.id)}
              onEdit={() => onEditBlock?.(block.id)}
            >
              <BlockRenderer block={block} />
            </DashboardBlockWrapper>
          </Box>
        ))}
      </Responsive>

      {isEditing && onAddBlock && (
        <Tooltip title="新增區塊" placement="left">
          <Fab
            color="primary"
            onClick={onAddBlock}
            sx={{
              position: "fixed",
              bottom: 32,
              right: 32,
            }}
          >
            <AddIcon />
          </Fab>
        </Tooltip>
      )}
    </Box>
  );
};

export default DashboardCanvas;