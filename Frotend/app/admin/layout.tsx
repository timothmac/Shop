"use client";

import React, { useEffect, useState } from "react";
import type { ReactNode } from "react";
import AdminHeader from "../components/AdminHeader";
import LoginForm from "../components/LoginForm"; // Ваш компонент логіна
import { Box, Typography } from "@mui/material";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [authorized, setAuthorized] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const parsed = JSON.parse(userStr).user;
        if (parsed && parsed.role === "admin") {
          setAuthorized(true);
        } else {
          setAuthorized(false);
          setShowLogin(true);
        }
      } catch (error) {
        console.error("Помилка парсингу даних користувача:", error);
        setAuthorized(false);
        setShowLogin(true);
      }
    } else {
      setAuthorized(false);
      setShowLogin(true);
    }
  }, []);

  // Якщо користувач не авторизований, показуємо логін-форму по центру екрану
  if (!authorized && showLogin) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          width: "100vw",
          gap: 2,
        }}
      >
        <Typography variant="h4" component="h1">
          Увійти як адмін
        </Typography>
        <LoginForm
          onLoginSuccess={() => {
            setAuthorized(true);
            setShowLogin(false);
          }}
        />
      </Box>
    );
  }

  // Якщо авторизований, повертаємо контент адмін-панелі
  return (
    <>
      <AdminHeader />
      <main>{children}</main>
    </>
  );
}
