"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  fetchDashboardOverview, 
  fetchPaymentsOverview, 
  fetchWeeklyProfit, 
  fetchDeviceUsage 
} from "@/components/redux/action/dashboard/dashboardAction";
import { RootState } from "@/components/redux/reducer";
import { PaymentsOverview } from "@/components/Charts/payments-overview";
import { UsedDevices } from "@/components/Charts/used-devices";
import { WeeksProfit } from "@/components/Charts/weeks-profit";
import { ChatsCard } from "./chats-card";
import { OverviewCardsGroup } from "./overview-cards";

interface DashboardClientProps {
  selectedTimeFrame?: string;
}

export default function DashboardClient({ selectedTimeFrame }: DashboardClientProps) {
  const dispatch = useDispatch();
  const { 
    overview, 
    paymentsOverview, 
    weeklyProfit, 
    deviceUsage,
    loading 
  } = useSelector((state: RootState) => state.dashboard);

  useEffect(() => {
    // Fetch all dashboard data when component mounts
    dispatch(fetchDashboardOverview());
    dispatch(fetchPaymentsOverview(selectedTimeFrame || "monthly"));
    dispatch(fetchWeeklyProfit(selectedTimeFrame || "this week"));
    dispatch(fetchDeviceUsage(selectedTimeFrame || "monthly"));
  }, [dispatch, selectedTimeFrame]);

  return (
    <>
      <OverviewCardsGroup />

      <div className="mt-7.5 grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
        <div className="col-span-12 xl:col-span-8">
          <div className="grid gap-4 md:gap-6 2xl:gap-7.5">
            <PaymentsOverview 
              timeFrame={selectedTimeFrame} 
              data={paymentsOverview}
              loading={loading.paymentsOverview}
            />
            <WeeksProfit 
              timeFrame={selectedTimeFrame} 
              data={weeklyProfit}
              loading={loading.weeklyProfit}
            />
          </div>
        </div>

        <div className="col-span-12 xl:col-span-4">
          <div className="grid gap-4 md:gap-6 2xl:gap-7.5">
            <UsedDevices 
              timeFrame={selectedTimeFrame} 
              data={deviceUsage}
              loading={loading.deviceUsage}
            />
            <ChatsCard />
          </div>
        </div>
      </div>

      {/* Loading indicator */}
      {loading.overview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-2 text-sm">Loading dashboard data...</p>
          </div>
        </div>
      )}
    </>
  );
} 