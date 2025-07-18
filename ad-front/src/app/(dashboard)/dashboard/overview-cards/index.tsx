"use client";

import { compactFormat } from "@/lib/format-number";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardOverview } from "@/components/redux/action/dashboard/dashboardAction";
import { RootState } from "@/components/redux/reducer";
import { OverviewCard } from "./card";
import * as icons from "./icons";
import Link from "next/link";

export function OverviewCardsGroup() {
  const dispatch = useDispatch();
  const { overview, loading } = useSelector((state: RootState) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardOverview());
  }, [dispatch]);

  // Use Redux data if available, otherwise show loading or fallback
  if (loading.overview || !overview) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded-lg dark:bg-gray-700"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      <OverviewCard
        label="Total Views"
        data={{
          ...overview.views,
          value: compactFormat(overview.views.value),
        }}
        Icon={icons.Views}
      />

      <OverviewCard
        label="Total Profit"
        data={{
          ...overview.profit,
          value: "$" + compactFormat(overview.profit.value),
        }}
        Icon={icons.Profit}
      />

      <OverviewCard
        label="Total Products"
        data={{
          ...overview.products,
          value: compactFormat(overview.products.value),
        }}
        Icon={icons.Product}
      />

      <OverviewCard
        label="Total Users"
        data={{
          ...overview.users,
          value: compactFormat(overview.users.value),
        }}
        Icon={icons.Users}
      />

      {/* Hero Sliders Quick Access Card */}
      <Link href="/banners/hero-sliders" className="block">
        <div className="border border-gray-200 rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>

          <div className="mt-6 flex items-end justify-between">
            <dl>
              <dt className="mb-1.5 text-heading-6 font-bold text-dark dark:text-white">
                Hero Sliders
              </dt>
              <dd className="text-sm font-medium text-dark-6">Manage Sliders</dd>
            </dl>

            <div className="text-sm font-medium text-blue-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </Link>

      {/* Categories Quick Access Card */}
      <Link href="/products/categories" className="block">
        <div className="border border-gray-200 rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>

          <div className="mt-6 flex items-end justify-between">
            <dl>
              <dt className="mb-1.5 text-heading-6 font-bold text-dark dark:text-white">
                Categories
              </dt>
              <dd className="text-sm font-medium text-dark-6">Manage Categories</dd>
            </dl>

            <div className="text-sm font-medium text-green-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
