"use client";

import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";

const AdminHeader = () => {
  const router = useRouter();

  const handleLogout = () => {
    // Очистка данных администратора (например, из localStorage)
    localStorage.removeItem("user");
    router.push("/");
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#333" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">
          <Link href="/admin" style={{ color: "inherit", textDecoration: "none" }}>
            Адмін-панель
          </Link>
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button color="inherit">
            <Link
              href="/admin/products"
              style={{ color: "inherit", textDecoration: "none" }}
            >
              ТОВАРИ
            </Link>
          </Button>
       
          <Button color="inherit">
            <Link
              href="/admin/users"
              style={{ color: "inherit", textDecoration: "none" }}
            >
              Користувачі
            </Link>
          </Button>
          <Button color="inherit" onClick={handleLogout}>
            Вийти
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AdminHeader;
