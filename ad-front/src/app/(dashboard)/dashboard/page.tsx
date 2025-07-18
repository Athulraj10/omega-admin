import { createTimeFrameExtractor } from "@/utils/timeframe-extractor";
import DashboardClient from "./DashboardClient";

type PropsType = {
  searchParams: Promise<{
    selected_time_frame?: string;
  }>;
};

export default async function Home({ searchParams }: PropsType) {
  const { selected_time_frame } = await searchParams;

  return <DashboardClient selectedTimeFrame={selected_time_frame} />;
}
