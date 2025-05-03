import React from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import HomeIcon from "@mui/icons-material/Home";
import ChatIcon from "@mui/icons-material/ChatBubbleOutline";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/AccountCircle";

const ICON_SIZE = { fontSize: 28 };

export default function Sidebar() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 72,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 72,
          boxSizing: "border-box",
          backgroundColor: "#1E1E1E",
          borderRight: "1px solid #333",
        },
      }}
    >
      <List>
        {[HomeIcon, ChatIcon, SearchIcon, SettingsIcon, PersonIcon].map(
          (Icon, idx) => (
            <ListItemButton
              key={idx}
              sx={{
                justifyContent: "center",
                py: 2,
              }}
            >
              <ListItemIcon sx={{ justifyContent: "center", color: "#bbb" }}>
                <Icon sx={ICON_SIZE} />
              </ListItemIcon>
            </ListItemButton>
          )
        )}
      </List>
    </Drawer>
  );
}
