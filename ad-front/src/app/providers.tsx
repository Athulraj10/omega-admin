"use client";

import React from "react";
import { Provider as ReduxProvider } from "react-redux";
import { ThemeProvider } from "next-themes";
import { SidebarProvider } from "@/components/Layouts/sidebar/sidebar-context";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { store } from "@/components/redux/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <ThemeProvider defaultTheme="light" attribute="class">
        <CurrencyProvider>
          <ToastContainer position="top-right" />
          <SidebarProvider>{children}</SidebarProvider>
        </CurrencyProvider>
      </ThemeProvider>
    </ReduxProvider>
  );
}
