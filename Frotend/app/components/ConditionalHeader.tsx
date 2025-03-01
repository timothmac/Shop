"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";

export default function ConditionalHeader() {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin");
  const isManagerPage = pathname.startsWith("/manager");

  if (!isAdminPage && !isManagerPage) {
    return <Header />;
  }
  return null;
}
