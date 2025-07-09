import React from "react";

export default function UsersLayout({
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