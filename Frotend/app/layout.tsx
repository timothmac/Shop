import "./globals.css";
import type { ReactNode } from "react";
import { CartProvider } from "./contetx/cartContext";
import ConditionalHeader from "./components/ConditionalHeader";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <CartProvider>
          <ConditionalHeader />
          <main>{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}
