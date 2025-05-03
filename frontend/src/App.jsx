// frontend/src/App.jsx
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme, { gradientAnimation } from "./theme";

import Sidebar from "./components/Sidebar";
import NavBar from "./components/NavBar";
import ChatWindow from "./components/ChatWindow";
import CartDrawer from "./components/CartDrawer";

const QUICK_PROMPTS = [
  "Find me an ML developer at $30/hr",
  "Show me React experts under $28/hr",
  "I need a Computer Vision specialist at $29/hr",
];

export default function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setCartOpen] = useState(false);
  const [started, setStarted]     = useState(false);
  const [initialPrompt, setInitialPrompt] = useState("");

  const toggleCart = () => setCartOpen(o => !o);
  const kickOffChat = prompt => { setInitialPrompt(prompt); setStarted(true); };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box
        sx={{
          display: "flex",
          height: "100vh",
          background: "linear-gradient(135deg, #1DBF73 0%, #1D9147 50%, #1DBF73 100%)",
          backgroundSize: "200% 200%",
          animation: `${gradientAnimation} 15s ease infinite`,
        }}
      >
        <Sidebar />

        <Box flex={1} display="flex" flexDirection="column">
          <NavBar cartCount={cartItems.length} onCartClick={toggleCart} />

          <Box flex={1} position="relative">
            {!started ? (
              <Box
                height="100%"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                px={{ xs: 2, sm: 4 }}
                textAlign="center"
              >
                <Typography variant="h3" gutterBottom>
                  Welcome to Freelancer Finder
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" mb={4}>
                  Quickly find and add freelancers to your cart with AI-powered search.
                </Typography>
                <Box display="flex" gap={2} flexWrap="wrap" justifyContent="center">
                  {QUICK_PROMPTS.map(prompt => (
                    <Chip
                      key={prompt}
                      label={prompt}
                      color="primary"
                      clickable
                      onClick={() => kickOffChat(prompt)}
                    />
                  ))}
                </Box>
              </Box>
            ) : (
              <ChatWindow
                initialPrompt={initialPrompt}
                onCartUpdate={setCartItems}
                onViewCart={toggleCart}
              />
            )}
          </Box>

          <CartDrawer
            open={isCartOpen}
            onClose={toggleCart}
            items={cartItems}
            onRemove={(i) => setCartItems(ci => ci.filter((_, idx) => idx!==i))}
            onProceed={() => alert(
              `Proceeding to payment for: ${cartItems.map(f=>f.name).join(", ")}`
            )}
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
