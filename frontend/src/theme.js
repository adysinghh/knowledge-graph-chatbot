// frontend/src/theme.js
import { createTheme } from "@mui/material/styles";
import { keyframes } from "@emotion/react";

export const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#1DBF73", contrastText: "#fff" },
    background: { default: "#121212", paper: "#1E1E1E" },
  },
  typography: { fontFamily: "Inter, sans-serif" },
});

export default theme;
