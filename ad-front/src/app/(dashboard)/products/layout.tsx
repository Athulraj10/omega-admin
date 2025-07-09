import React from "react";

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="p-4 md:p-6 2xl:p-10">
      {children}
    </div>
  );
} 