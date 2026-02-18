import type { ClientDashboardData } from "@/types";

const fullDashboard: ClientDashboardData = {
  metrics: {
    totalAssets: 1527250,
    assetsChangePercent: 5.1,
    ytdReturn: 12.4,
    benchmarkYtdReturn: "vs. S&P 500: +14.2%",
    totalGainLoss: 168450,
    gainLossLabel: "Since inception",
    riskScore: 6.5,
    riskLabel: "Moderate-aggressive",
  },
  returnsByPeriod: [
    { period: "QTD", portfolio: 5.1, benchmark: 4.8 },
    { period: "YTD", portfolio: 12.4, benchmark: 14.2 },
    { period: "1 Year", portfolio: 18.7, benchmark: 22.1 },
    { period: "3 Year", portfolio: 9.2, benchmark: 10.5 },
  ],
  riskMetrics: [
    { name: "Standard Deviation", value: 12.3, displayValue: "12.3%", barPercent: 65 },
    { name: "Sharpe Ratio", value: 1.42, displayValue: "1.42", barPercent: 71 },
    { name: "Beta", value: 0.87, displayValue: "0.87", barPercent: 44 },
    { name: "Max Drawdown", value: -18.2, displayValue: "-18.2%", barPercent: 90 },
  ],
  holdings: [
    { security: "Vanguard Total Stock Market", ticker: "VTI", value: 485300, allocation: 31.8, qtd: 6.2, ytd: 14.5 },
    { security: "Vanguard International Stock", ticker: "VXUS", value: 304200, allocation: 19.9, qtd: 4.8, ytd: 9.3 },
    { security: "Vanguard Total Bond Market", ticker: "BND", value: 456800, allocation: 29.9, qtd: 1.2, ytd: 2.8 },
    { security: "iShares TIPS Bond", ticker: "TIP", value: 152000, allocation: 10, qtd: -0.5, ytd: 1.1 },
    { security: "Vanguard REIT Index", ticker: "VNQ", value: 128950, allocation: 8.4, qtd: 3.8, ytd: 8.7 },
  ],
};

const partialDashboard: ClientDashboardData = {
  metrics: {
    totalAssets: 892000,
    assetsChangePercent: 2.3,
    ytdReturn: 7.8,
    benchmarkYtdReturn: "vs. S&P 500: +14.2%",
    totalGainLoss: 45000,
    gainLossLabel: "Since inception",
    riskScore: 4.2,
    riskLabel: "Moderate",
  },
  returnsByPeriod: [
    { period: "QTD", portfolio: 2.1, benchmark: 4.8 },
    { period: "YTD", portfolio: 7.8, benchmark: 14.2 },
  ],
  riskMetrics: [
    { name: "Standard Deviation", value: 9.1, displayValue: "9.1%", barPercent: 45 },
    { name: "Sharpe Ratio", value: 0.95, displayValue: "0.95", barPercent: 48 },
  ],
  holdings: [
    { security: "Vanguard Total Stock Market", ticker: "VTI", value: 267000, allocation: 30, qtd: 5.2, ytd: 12.1 },
    { security: "Vanguard Total Bond Market", ticker: "BND", value: 356000, allocation: 40, qtd: 0.8, ytd: 1.9 },
    { security: "Vanguard Money Market", ticker: "VMFXX", value: 134000, allocation: 15, qtd: 0.4, ytd: 1.2 },
  ],
};

const minimalDashboard: ClientDashboardData = {
  metrics: {
    totalAssets: 250000,
    ytdReturn: 3.2,
    riskScore: 3,
    riskLabel: "Conservative",
  },
};

export const mockDashboardData: Record<string, ClientDashboardData> = {
  "client-1": fullDashboard,
  "client-2": partialDashboard,
  "client-3": minimalDashboard,
};
