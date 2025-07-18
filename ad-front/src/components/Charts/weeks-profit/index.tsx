import { PeriodPicker } from "@/components/period-picker";
import { cn } from "@/lib/utils";
import { WeeksProfitChart } from "./chart";

type PropsType = {
  timeFrame?: string;
  className?: string;
  data?: {
    sales: { x: string; y: number }[];
    revenue: { x: string; y: number }[];
  } | null;
  loading?: boolean;
};

export function WeeksProfit({ 
  className, 
  timeFrame,
  data,
  loading = false,
}: PropsType) {
  // Use provided data or fallback to empty data
  const chartData = data || {
    sales: [],
    revenue: []
  };

  return (
    <div
      className={cn(
        "rounded-[10px] bg-white px-7.5 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
          Profit {timeFrame || "this week"}
        </h2>

        <PeriodPicker
          items={["this week", "last week"]}
          defaultValue={timeFrame || "this week"}
          sectionKey="weeks_profit"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <WeeksProfitChart data={chartData} />
      )}
    </div>
  );
}
