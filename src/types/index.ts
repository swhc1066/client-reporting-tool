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
