"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/Layouts/header";
import { Sidebar } from "@/components/Layouts/sidebar";

const authRoutes = ["/sign-in", "/signup", "/forget-password", "/reset-password"];

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showLayout = !authRoutes.includes(pathname);

  return (
    <div className="min-h-screen w-full flex flex-col">
      {showLayout ? (
        <div className="flex flex-row min-h-screen">
          <Sidebar />

          <div className="flex-1 flex flex-col">
            <Header />
            <main className="flex-1 p-4 overflow-auto bg-gray-50 dark:bg-[#122031]">{children}</main>
          </div>
        </div>
      ) : (
        <main className="p-4">{children}</main>
      )}
    </div>
  );
}
