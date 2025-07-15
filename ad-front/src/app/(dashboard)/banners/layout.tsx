import React from 'react';

export default function BannersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
} 