import type { ClientPresentationData } from "@/types";

const fullData: ClientPresentationData = {
  overview: {
    clientName: "Acme Holdings LLC",
    subtitle: "Portfolio review",
    asOfDate: "2025-01-31",
  },
  allocation: {
    items: [
      { label: "Equities", value: 60 },
      { label: "Fixed income", value: 25 },
      { label: "Alternatives", value: 10 },
      { label: "Cash", value: 5 },
    ],
    total: 100,
  },
  performance: {
    items: [
      { period: "1Y", return: 8.2 },
      { period: "3Y", return: 6.1 },
      { period: "5Y", return: 7.4 },
    ],
  },
  summary: {
    highlights: [
      "Portfolio aligned to stated risk tolerance",
      "Rebalancing recommended in Q2",
      "Tax-loss harvesting opportunities identified",
    ],
  },
};

const partialData: ClientPresentationData = {
  overview: {
    clientName: "River Family Trust",
    asOfDate: "2025-01-31",
  },
  allocation: {
    items: [
      { label: "Equities", value: 45 },
      { label: "Fixed income", value: 40 },
      { label: "Cash", value: 15 },
    ],
    total: 100,
  },
  performance: {
    items: [{ period: "1Y", return: 5.3 }],
  },
};

const minimalData: ClientPresentationData = {
  overview: {
    clientName: "Summit Advisory",
  },
};

export const mockClientData: Record<string, ClientPresentationData> = {
  "client-1": fullData,
  "client-2": partialData,
  "client-3": minimalData,
};
