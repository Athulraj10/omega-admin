import React from "react";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="p-4 md:p-6 2xl:p-10">
      <div className="mx-auto max-w-7xl">
        {children}
      </div>
    </div>
  );
} 