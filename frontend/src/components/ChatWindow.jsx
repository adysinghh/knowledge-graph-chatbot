// frontend/src/components/ChatWindow.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Tooltip,
  Button,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import axios from "axios";

export default function ChatWindow({
  initialPrompt,
  onCartUpdate,
  onViewCart,
}) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const sentInitial = useRef(false);
  const scrollRef = useRef();

  // Send initial prompt once
  useEffect(() => {
    if (initialPrompt && !sentInitial.current) {
      sentInitial.current = true;
      sendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async text => {
    if (!text.trim()) return;
    setMessages(m => [...m, { from: "user", text }]);
    setInput("");

    const lc = text.trim().toLowerCase();
    if (lc === "view cart" || lc === "open cart") {
      setMessages(m => [...m, { from: "system", text: "Opening cart…" }]);
      onViewCart();
      return;
    }

    // Call backend
    let botText;
    try {
      const { data } = await axios.post(
        "http://localhost:8001/chat",
        { message: text }
      );
      botText = data.response;
    } catch {
      setMessages(m => [
        ...m,
        { from: "bot", text: "Sorry, something went wrong." },
      ]);
      return;
    }

    // Parse portfolio link
    const addMatch = botText.match(
      /Added ([^(]+) \(\$\d+(\.\d+)?\/hr\) to your cart\. Portfolio: (\S+)/i
    );
    if (addMatch) {
      const [_, info, , portfolioUrl] = addMatch;
      // split out the “Added …” text before the URL
      const textOnly = botText.split("Portfolio:")[0].trim();
      setMessages(m => [
        ...m,
        { from: "bot", text: textOnly, portfolio: portfolioUrl },
      ]);
      // Refresh cart
      try {
        const { data: c } = await axios.get("http://localhost:8001/cart");
        onCartUpdate(c.cart);
      } catch {}
    } else {
      setMessages(m => [...m, { from: "bot", text: botText }]);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Box flex={1} overflow="auto" p={2}>
        {messages.map((m, i) => (
          <Box
            key={i}
            mb={1}
            p={1.5}
            sx={{
              maxWidth: "75%",
              bgcolor:
                m.from === "bot"
                  ? "#2A2A2A"
                  : m.from === "system"
                  ? "#444"
                  : "primary.main",
              color: "#fff",
              borderRadius: 2,
              alignSelf: m.from === "bot" ? "flex-start" : "flex-end",
            }}
          >
            <Typography variant="body2">{m.text}</Typography>
            {m.portfolio && (
              <Button
                variant="outlined"
                size="small"
                sx={{ mt: 1, color: "#1DBF73", borderColor: "#1DBF73" }}
                onClick={() => window.open(m.portfolio, "_blank")}
              >
                View Portfolio
              </Button>
            )}
          </Box>
        ))}
        <div ref={scrollRef} />
      </Box>

      <Paper
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          p: 1,
          bgcolor: "#121212",
          borderTop: "1px solid #333",
        }}
      >
        <Tooltip title="View Cart">
          <IconButton
            onClick={() => {
              setMessages(m => [...m, { from: "system", text: "Opening cart…" }]);
              onViewCart();
            }}
          >
            <ShoppingCartIcon sx={{ color: "primary.main" }} />
          </IconButton>
        </Tooltip>

        <TextField
          variant="standard"
          placeholder="Type your message…"
          InputProps={{ disableUnderline: true, sx: { color: "#fff" } }}
          fullWidth
          value={input}
          onChange={e => setInput(e.target.value)}
        />

        <IconButton type="submit" color="primary">
          <SendIcon />
        </IconButton>
      </Paper>
    </Box>
  );
}
