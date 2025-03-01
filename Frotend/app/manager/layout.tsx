"use client";

import React, { useEffect, useState } from "react";
import type { ReactNode } from "react";
import ManagerHeader from "../components/ManagerHeader";
import LoginForm from "../components/LoginForm";
import { Box, Typography } from "@mui/material";

export default function ManagerLayout({ children }: { children: ReactNode }) {
  const [authorized, setAuthorized] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const parsed = JSON.parse(userStr).user;
        console.log("Parsed user:", parsed);
        if (parsed && parsed.role === "manager") {
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
          Увійти як менеджер
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

  return (
    <>
      <ManagerHeader />
      <main>{children}</main>
    </>
  );
}
