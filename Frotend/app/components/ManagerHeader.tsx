"use client";

import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useRouter } from "next/navigation";

export default function ManagerHeader() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("user"); 
    router.push("/"); 
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Панель менеджера
        </Typography>
        <Box>
          <Button
            color="inherit"
            onClick={() => router.push("/manager/products")}
          >
            Товари
          </Button>
          <Button
            color="inherit"
            onClick={() => router.push("/manager/orders")}
          >
            Замовлення
          </Button>
          <Button color="inherit" onClick={handleLogout}>
            Вийти
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
