// src/components/common/GlobalToast.tsx
import { Snackbar, Alert } from "@mui/material";
import { useToast } from "../../hooks/useToast";

export const GlobalToast = () => {
  const { open, message, severity, close } = useToast();

  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={close}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert onClose={close} severity={severity} variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
};
