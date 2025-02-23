import "./globals.css";
import type { ReactNode } from "react";
import { CartProvider } from "./contetx/cartContext";
import Header from "./components/Header";

export const metadata = {
  title: "Название проекта",
  description: "Описание проекта",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <CartProvider>
          <Header />
          <main>{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}
