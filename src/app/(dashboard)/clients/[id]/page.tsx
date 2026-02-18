"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useClientData } from "@/lib/hooks/useClientData";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AllocationScreen } from "@/components/presentation";
import {
  Presentation,
  DollarSign,
  TrendingUp,
  BarChart3,
  Gauge,
} from "lucide-react";
import type {
  ClientDashboardData,
  ClientDashboardMetrics,
  ClientPresentationData,
} from "@/types";
import { cn } from "@/lib/utils";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercent(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  valueClassName,
  subtitleClassName,
}: {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ElementType;
  valueClassName?: string;
  subtitleClassName?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="size-4 text-muted-foreground" aria-hidden />
      </CardHeader>
      <CardContent>
        <div className={cn("text-2xl font-bold", valueClassName)}>{value}</div>
        {subtitle && (
          <p className={cn("mt-1 text-xs text-muted-foreground", subtitleClassName)}>
            {subtitle}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function PerformanceTabContent({ dashboard }: { dashboard: ClientDashboardData }) {
  const returns = dashboard.returnsByPeriod ?? [];
  const risk = dashboard.riskMetrics ?? [];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Returns by Period</CardTitle>
          <CardDescription>
            Performance across different timeframes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {returns.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No returns data available.
            </p>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2 text-sm font-medium text-muted-foreground">
                <div>Period</div>
                <div className="text-right">Portfolio</div>
                <div className="text-right">Benchmark</div>
              </div>
              {returns.map((row) => (
                <div
                  key={row.period}
                  className="grid grid-cols-3 gap-2 border-b border-border py-2 last:border-0"
                >
                  <div>{row.period}</div>
                  <div
                    className={cn(
                      "text-right font-medium tabular-nums",
                      row.portfolio >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                    )}
                  >
                    {formatPercent(row.portfolio)}
                  </div>
                  <div className="text-right tabular-nums text-muted-foreground">
                    {formatPercent(row.benchmark)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Risk Metrics</CardTitle>
          <CardDescription>
            Portfolio volatility and risk analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          {risk.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No risk metrics available.
            </p>
          ) : (
            <div className="space-y-4">
              {risk.map((item) => (
                <div key={item.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{item.name}</span>
                    <span
                      className={cn(
                        "font-medium tabular-nums",
                        typeof item.value === "number" && item.value < 0
                          ? "text-red-600 dark:text-red-400"
                          : ""
                      )}
                    >
                      {item.displayValue}
                    </span>
                  </div>
                  {item.barPercent != null && (
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div
                        className={cn(
                          "h-2 rounded-full",
                          typeof item.value === "number" && item.value < 0
                            ? "bg-red-500"
                            : "bg-muted-foreground/60"
                        )}
                        style={{ width: `${Math.min(item.barPercent, 100)}%` }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function HoldingsTabContent({ dashboard }: { dashboard: ClientDashboardData }) {
  const holdings = dashboard.holdings ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete Holdings Detail</CardTitle>
        <CardDescription>
          All positions with performance metrics
        </CardDescription>
      </CardHeader>
      <CardContent>
        {holdings.length === 0 ? (
          <p className="text-sm text-muted-foreground">No holdings data.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="pb-3 font-medium">Security</th>
                  <th className="pb-3 font-medium">Ticker</th>
                  <th className="pb-3 font-medium text-right">Value</th>
                  <th className="pb-3 font-medium text-right">Allocation</th>
                  <th className="pb-3 font-medium text-right">QTD</th>
                  <th className="pb-3 font-medium text-right">YTD</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((h) => (
                  <tr key={h.ticker} className="border-b border-border">
                    <td className="py-3 font-medium">{h.security}</td>
                    <td className="py-3">{h.ticker}</td>
                    <td className="py-3 text-right tabular-nums">
                      {formatCurrency(h.value)}
                    </td>
                    <td className="py-3 text-right tabular-nums">
                      {h.allocation}%
                    </td>
                    <td className="py-3 text-right">
                      <span
                        className={cn(
                          "inline-flex rounded px-2 py-0.5 text-xs font-medium",
                          h.qtd >= 0
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        )}
                      >
                        {formatPercent(h.qtd)}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <span
                        className={cn(
                          "inline-flex rounded px-2 py-0.5 text-xs font-medium",
                          h.ytd >= 0
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        )}
                      >
                        {formatPercent(h.ytd)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ClientDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32" />
              <Skeleton className="mt-2 h-3 w-40" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

function renderMetricCards(metrics: ClientDashboardMetrics | undefined) {
  if (!metrics) return null;

  return (
    <>
      <MetricCard
        title="Total Assets"
        value={formatCurrency(metrics.totalAssets)}
        subtitle={
          metrics.assetsChangePercent != null
            ? `${formatPercent(metrics.assetsChangePercent)} from last quarter`
            : undefined
        }
        icon={DollarSign}
        subtitleClassName={
          metrics.assetsChangePercent != null && metrics.assetsChangePercent >= 0
            ? "text-green-600 dark:text-green-400"
            : undefined
        }
      />
      <MetricCard
        title="YTD Return"
        value={
          metrics.ytdReturn != null ? formatPercent(metrics.ytdReturn) : "N/A"
        }
        subtitle={metrics.benchmarkYtdReturn}
        icon={TrendingUp}
        valueClassName={
          metrics.ytdReturn != null && metrics.ytdReturn >= 0
            ? "text-green-600 dark:text-green-400"
            : ""
        }
      />
      <MetricCard
        title="Total Gain/Loss"
        value={
          metrics.totalGainLoss != null
            ? `${metrics.totalGainLoss >= 0 ? "+" : ""}${formatCurrency(metrics.totalGainLoss)}`
            : "N/A"
        }
        subtitle={metrics.gainLossLabel}
        icon={BarChart3}
        valueClassName={
          metrics.totalGainLoss != null && metrics.totalGainLoss >= 0
            ? "text-green-600 dark:text-green-400"
            : ""
        }
      />
      <MetricCard
        title="Risk Score"
        value={
          metrics.riskScore != null ? `${metrics.riskScore}/10` : "N/A"
        }
        subtitle={metrics.riskLabel}
        icon={Gauge}
      />
    </>
  );
}

export default function ClientDetailsPage() {
  const params = useParams();
  const clientId = typeof params.id === "string" ? params.id : null;
  const { client, data, dashboard, loading, error } = useClientData(clientId);

  if (loading || !clientId) {
    return <ClientDetailsSkeleton />;
  }

  if (error || !client) {
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardHeader>
          <CardTitle className="text-destructive">Client not found</CardTitle>
          <CardDescription>
            {error?.message ?? "Unable to load this client."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline">
            <Link href="/clients">Back to Clients</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const dashboardData = dashboard ?? {};
  const presentationData: ClientPresentationData = data ?? {};

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Advanced Dashboard
          </h1>
          <p className="mt-1 text-muted-foreground">
            Comprehensive portfolio analytics and detailed performance metrics
          </p>
        </div>
        <Button asChild size="lg">
          <Link href={`/clients/${client.id}/present`}>
            <Presentation className="mr-2 size-4" aria-hidden />
            Launch Presentation
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {renderMetricCards(dashboardData.metrics)}
      </div>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList className="bg-muted">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="holdings">Detailed Holdings</TabsTrigger>
          <TabsTrigger value="allocation">Allocation Analysis</TabsTrigger>
          <TabsTrigger value="account">Account Details</TabsTrigger>
        </TabsList>
        <TabsContent value="performance">
          <PerformanceTabContent dashboard={dashboardData} />
        </TabsContent>
        <TabsContent value="holdings">
          <HoldingsTabContent dashboard={dashboardData} />
        </TabsContent>
        <TabsContent value="allocation">
          <Card>
            <CardContent className="pt-6">
              <AllocationScreen data={presentationData} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
              <CardDescription>
                Client identifier and account information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm text-muted-foreground">Client Name</dt>
                  <dd className="font-medium">{client.name}</dd>
                </div>
                {client.identifier && (
                  <div>
                    <dt className="text-sm text-muted-foreground">Identifier</dt>
                    <dd className="font-medium">{client.identifier}</dd>
                  </div>
                )}
                {presentationData.overview?.asOfDate && (
                  <div>
                    <dt className="text-sm text-muted-foreground">As of Date</dt>
                    <dd className="font-medium">
                      {presentationData.overview.asOfDate}
                    </dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
