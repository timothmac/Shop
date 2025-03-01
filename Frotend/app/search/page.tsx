// File: app/search/page.tsx
"use client";

import { Suspense } from "react";
import RealSearchPage from "./RealSearchPage";

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RealSearchPage />
    </Suspense>
  );
}
