import React from "react";

export default function SellersLayout({ children }: { children: React.ReactNode }) {
  return <div className="p-4 md:p-6 lg:p-8 w-full h-full bg-white dark:bg-neutral-900 rounded-xl shadow-md">{children}</div>;
} 