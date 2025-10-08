// src/components/common/ExpandableStatusBar.tsx
import React from "react";
import {
  Paper,
  AccordionDetails,
  Accordion,
  AccordionSummary,
} from "@mui/material";

interface Props {
  id: React.Key;
  isExpanded?: boolean;
  handleExpanded?: (event: React.SyntheticEvent, expanded: boolean) => void;
  title: React.ReactElement;
  detail: React.ReactElement;
}
export const ExpandableStatusBar: React.FC<Props> = ({
  id: key,
  isExpanded,
  handleExpanded,
  title,
  detail,
}) => {
  return (
    <Paper key={key} elevation={1} sx={{ mb: 1 }}>
      <Accordion
        expanded={isExpanded}
        onChange={handleExpanded}
        sx={{
          "&.MuiAccordion-root": {
            boxShadow: "none",
            "&::before": { display: "none" },
          },
        }}
      >
        <AccordionSummary
          aria-controls={`panel-${key}-content`}
          id={`panel-${key}-header`}
          sx={{
            minHeight: "48px",
            "&.Mui-expanded": { minHeight: "48px" },
            "& .MuiAccordionSummary-content": {
              alignItems: "center",
              margin: "12px 0",
              "&.Mui-expanded": { margin: "12px 0" },
            },
          }}
        >
          {title}
        </AccordionSummary>
        <AccordionDetails>{detail}</AccordionDetails>
      </Accordion>
    </Paper>
  );
};
