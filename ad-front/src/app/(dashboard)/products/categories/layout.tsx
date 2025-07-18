"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeftIcon } from "@/assets/icons";

const CategoriesLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const getBreadcrumbs = () => {
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs = [
      { name: 'Dashboard', href: '/dashboard' },
      { name: 'Products', href: '/products/list' },
      { name: 'Categories', href: '/products/categories' }
    ];

    if (pathname.includes('/manage')) {
      breadcrumbs.push({ name: 'Manage', href: '/products/categories/manage' });
    } else if (pathname.includes('/add')) {
      breadcrumbs.push({ name: 'Add Category', href: '/products/categories/add' });
    } else if (pathname.includes('/demo')) {
      breadcrumbs.push({ name: 'Demo', href: '/products/categories/demo' });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto py-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              {breadcrumbs.map((breadcrumb, index) => (
                <li key={breadcrumb.href}>
                  <div className="flex items-center">
                    {index > 0 && (
                      <span className="text-gray-400 mx-2">/</span>
                    )}
                    <Link
                      href={breadcrumb.href}
                      className={`text-sm font-medium ${
                        index === breadcrumbs.length - 1
                          ? 'text-gray-900 cursor-default'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {breadcrumb.name}
                    </Link>
                  </div>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>

      {/* Page Content */}
      <div className="py-6">
        {children}
      </div>
    </div>
  );
};

export default CategoriesLayout; 