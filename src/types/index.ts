/**
 * Shared types for client list and per-client presentation data.
 * Same shape for mock (MVP) and future CRM API.
 */

export interface Client {
  id: string;
  name: string;
  identifier?: string;
}

export interface ClientOverview {
  clientName?: string;
  subtitle?: string;
  asOfDate?: string;
}

export interface AllocationItem {
  label: string;
  value: number;
}

export interface ClientAllocation {
  items?: AllocationItem[];
  total?: number;
}

export interface PerformanceItem {
  period: string;
  return: number;
}

export interface ClientPerformance {
  items?: PerformanceItem[];
}

export interface ClientSummary {
  highlights?: string[];
}

export interface ClientPresentationData {
  overview?: ClientOverview;
  allocation?: ClientAllocation;
  performance?: ClientPerformance;
  summary?: ClientSummary;
}

export interface ClientDashboardMetrics {
  totalAssets: number;
  assetsChangePercent?: number;
  ytdReturn?: number;
  benchmarkYtdReturn?: string;
  totalGainLoss?: number;
  gainLossLabel?: string;
  riskScore?: number;
  riskLabel?: string;
}

export interface ReturnsByPeriodItem {
  period: string;
  portfolio: number;
  benchmark: number;
}

export interface RiskMetricItem {
  name: string;
  value: number | string;
  displayValue: string;
  barPercent?: number;
}

export interface HoldingItem {
  security: string;
  ticker: string;
  value: number;
  allocation: number;
  qtd: number;
  ytd: number;
}

export interface ClientDashboardData {
  metrics?: ClientDashboardMetrics;
  returnsByPeriod?: ReturnsByPeriodItem[];
  riskMetrics?: RiskMetricItem[];
  holdings?: HoldingItem[];
}
