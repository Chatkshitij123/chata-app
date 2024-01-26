import React, { useState } from "react";
import {
  Stack,
  Box,
  IconButton,
  Typography,
  Avatar,
  Divider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Bell,
  CaretLeft,
  Image,
  Info,
  Keyboard,
  Lock,
  PencilCircle,
  Note,
  Key,
} from "phosphor-react";
import { faker } from "@faker-js/faker";
import Shortcuts from "../../sections/settings/Shortcuts";
const Settings = () => {
  const theme = useTheme();
  const [openShortcuts, setOpenShortcuts] = useState(false);

  const handleOpenShortcuts = () => {
    setOpenShortcuts(true);
  };
  const handleCloseShortcuts = () => {
    setOpenShortcuts(false);
  };
  const list = [
    {
      key: 0,
      icon: <Bell size={20} />,
      title: "Notifications",
      onclick: () => {},
    },
    {
      key: 1,
      icon: <Lock size={20} />,
      title: "Privacy",
      onclick: () => {},
    },
    {
      key: 2,
      icon: <Key size={20} />,
      title: "Security",
      // onclick: handleOpenTheme
      onclick: () => {},
    },
    {
      key: 3,
      icon: <PencilCircle size={20} />,
      title: "Theme",
      onclick: () => {},
    },
    {
      key: 4,
      icon: <Image size={20} />,
      title: "Chat Wallpaper",
      onclick: () => {},
    },
    {
      key: 5,
      icon: <Note size={20} />,
      title: "Request Account Info",
      onclick: () => {},
    },
    {
      key: 6,
      icon: <Keyboard size={20} />,
      title: "Keyboard Shortcuts",
      onclick: handleOpenShortcuts,
      // onclick: () => {},
    },
    // we are going to change the property of keyboard shortcuts this is the reason why i place the lists in settings component
    {
      key: 7,
      icon: <Info size={20} />,
      title: "Help",
      onclick: () => {},
    },
  ];
  return (
    <>
      <Stack direction={"row"} sx={{ width: "100%" }}>
        {/* leftPanel */}
        <Box
          sx={{
            overflowY: "scroll",
            height: "100vh",
            width: 320,
            backgroundColor:
              theme.palette.mode === "light"
                ? "#F0F4FA"
                : theme.palette.background,
            boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
          }}
          className="scrollbar"
        >
          <Stack p={4} spacing={5}>
            {/* Header */}
            <Stack direction={"row"} alignItems="center" spacing={3}>
              <IconButton>
                <CaretLeft size={24} color="#4b4b4b" />
              </IconButton>
              <Typography variant="h6">Settings</Typography>
            </Stack>
            {/* Profile */}
            <Stack direction={"row"} spacing={3}>
              <Avatar
                sx={{ width: 56, height: 56 }}
                src={faker.image.avatar()}
                alt={faker.name.fullName()}
              />
              <Stack spacing={0.5}>
                <Typography variant="article">
                  {faker.name.fullName()}
                </Typography>
                <Typography variant="body2">{faker.random.words()}</Typography>
              </Stack>
            </Stack>
            {/* List of options */}
            <Stack spacing={4}>
              {list.map(({ key, icon, title, onclick }) => (
                <>
                  <Stack
                    spacing={2}
                    sx={{ cursor: "pointer" }}
                    onClick={onclick}
                  >
                    {/* we need to align these two groups in vertical direction 1. title 2. divider we need stack */}
                    <Stack direction={"row"} spacing={2} alignItems={"center"}>
                      {icon}
                      <Typography variant="body2">{title}</Typography>
                    </Stack>
                    {key !== 7 && <Divider />}
                  </Stack>
                </>
              ))}
            </Stack>
          </Stack>
        </Box>
        {/* RightPanel */}
      </Stack>
      {openShortcuts && (
        <Shortcuts open={openShortcuts} handleClose={handleCloseShortcuts} />
      )}
    </>
  );
};

export default Settings;
