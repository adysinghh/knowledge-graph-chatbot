import React from "react";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";

export default function CartDrawer({
  open,
  onClose,
  items,
  onRemove,
  onProceed,
}) {
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box
        width={300}
        p={2}
        display="flex"
        flexDirection="column"
        height="100%"
      >
        <Typography variant="h6" gutterBottom>
          Your Cart
        </Typography>
        <Divider />
        <List sx={{ flex: 1, overflow: "auto" }}>
          {items.length === 0 ? (
            <Typography sx={{ p: 2 }}>No freelancers added.</Typography>
          ) : (
            items.map((f, i) => (
              <ListItem
                key={i}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="remove"
                    onClick={() => onRemove(i)}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={f.name}
                  secondary={`$${f.rate}/hr`}
                />
              </ListItem>
            ))
          )}
        </List>
        <Divider />
        <Button
          variant="contained"
          color="primary"
          onClick={onProceed}
          disabled={items.length === 0}
          sx={{ mt: 2 }}
        >
          Proceed to Payment
        </Button>
      </Box>
    </Drawer>
  );
}
