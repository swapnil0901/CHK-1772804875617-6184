import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Egg,
  IndianRupee,
  Package,
  TrendingDown,
  TrendingUp,
  Skull,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { AppLayout, PageHeader } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui-kit";
import { useDashboardAnalytics } from "@/hooks/use-poultry";
import { cn, formatCurrency } from "@/lib/utils";

function toLabel(date: string): string {
  const parsed = new Date(`${date}T00:00:00`);
  return parsed.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}

export default function Dashboard() {
  const { data, isLoading, error } = useDashboardAnalytics();

  const eggChartData = useMemo(
    () =>
      (data?.charts.eggProduction ?? []).map((item) => ({
        ...item,
        label: toLabel(item.date),
      })),
    [data],
  );

  const feedChartData = useMemo(
    () =>
      (data?.charts.feedConsumption ?? []).map((item) => ({
        ...item,
        label: toLabel(item.date),
      })),
    [data],
  );

  const profitChartData = useMemo(
    () =>
      (data?.charts.profitAnalysis ?? []).map((item) => ({
        ...item,
        label: toLabel(item.date),
      })),
    [data],
  );

  if (isLoading) {
    return (
      <AppLayout>
        <PageHeader title="Farm Dashboard" description="Loading analytics..." />
      </AppLayout>
    );
  }

  if (error || !data) {
    return (
      <AppLayout>
        <PageHeader title="Farm Dashboard" description="Unable to load analytics." />
      </AppLayout>
    );
  }

  const todayStats = [
    {
      title: "Eggs Produced Today",
      value: data.today.eggsProduced.toLocaleString(),
      icon: Egg,
      color: "bg-primary/10 text-primary",
    },
    {
      title: "Broken Eggs",
      value: data.today.brokenEggs.toLocaleString(),
      icon: TrendingDown,
      color: "bg-destructive/10 text-destructive",
    },
    {
      title: "Total Revenue",
      value: formatCurrency(data.today.totalRevenue),
      icon: IndianRupee,
      color: "bg-success/15 text-success",
    },
    {
      title: "Total Cost",
      value: formatCurrency(data.today.totalCost),
      icon: Package,
      color: "bg-warning/15 text-warning",
    },
    {
      title: "Net Profit",
      value: formatCurrency(data.today.netProfit),
      icon: data.today.netProfit >= 0 ? TrendingUp : TrendingDown,
      color: data.today.netProfit >= 0 ? "bg-success/15 text-success" : "bg-destructive/10 text-destructive",
    },
  ];

  return (
    <AppLayout>
      <PageHeader
        title="Farm Dashboard"
        description="Egg production, feed usage, profit analysis, and smart alerts."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-8">
        {todayStats.map((item) => (
          <StatCard key={item.title} {...item} />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <ProfitCard label="Daily Profit" value={data.profit.daily} />
        <ProfitCard label="Monthly Profit" value={data.profit.monthly} />
        <ProfitCard label="Yearly Profit" value={data.profit.yearly} />
      </div>

      <Card className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="text-warning" size={20} />
          <h3 className="text-lg font-bold font-display">Today&apos;s Alerts</h3>
        </div>

        {data.alerts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No active alerts today.</p>
        ) : (
          <div className="space-y-3">
            {data.alerts.map((alert) => (
              <div
                key={alert.type}
                className={cn(
                  "rounded-xl border px-4 py-3",
                  alert.severity === "critical"
                    ? "border-destructive/40 bg-destructive/5"
                    : "border-warning/40 bg-warning/5",
                )}
              >
                <p className="font-semibold">{alert.title}</p>
                <p className="text-sm text-muted-foreground">{alert.message}</p>
                <p className="text-xs mt-1 text-muted-foreground">
                  SMS: {alert.smsSent ? "Sent" : "Not sent"}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="h-[360px]">
          <h3 className="text-lg font-bold font-display mb-4">Egg Production (Daily)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={eggChartData}>
              <defs>
                <linearGradient id="eggGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="eggsProduced"
                stroke="hsl(var(--primary))"
                fill="url(#eggGradient)"
                strokeWidth={2.5}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="h-[360px]">
          <h3 className="text-lg font-bold font-display mb-4">Feed Consumption (Daily)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={feedChartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="feedConsumedKg" fill="hsl(var(--warning))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="h-[360px]">
          <h3 className="text-lg font-bold font-display mb-4">Profit Analysis (Daily)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={profitChartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Line
                type="monotone"
                dataKey="profit"
                stroke="hsl(var(--success))"
                strokeWidth={3}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </AppLayout>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: string;
  icon: any;
  color: string;
}) {
  return (
    <motion.div whileHover={{ y: -3 }}>
      <Card className="h-full">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground uppercase tracking-wide">{title}</p>
          <div className={cn("rounded-xl p-2", color)}>
            <Icon size={18} />
          </div>
        </div>
        <p className="text-2xl font-bold font-display">{value}</p>
      </Card>
    </motion.div>
  );
}

function ProfitCard({ label, value }: { label: string; value: number }) {
  const isPositive = value >= 0;
  return (
    <Card>
      <div className="flex items-center gap-2 mb-1">
        {isPositive ? (
          <TrendingUp size={16} className="text-success" />
        ) : (
          <Skull size={16} className="text-destructive" />
        )}
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
      <p className={cn("text-2xl font-bold font-display", isPositive ? "text-success" : "text-destructive")}>
        {formatCurrency(value)}
      </p>
    </Card>
  );
}
