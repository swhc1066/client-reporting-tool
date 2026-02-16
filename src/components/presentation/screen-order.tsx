import type { ComponentType } from "react";
import type { ClientPresentationData } from "@/types";
import { TitleOverviewScreen } from "./screens/title-overview-screen";
import { AllocationScreen } from "./screens/allocation-screen";
import { PerformanceScreen } from "./screens/performance-screen";
import { SummaryScreen } from "./screens/summary-screen";

export type ScreenId = "overview" | "allocation" | "performance" | "summary";

export interface ScreenConfig {
  id: ScreenId;
  label: string;
  component: ComponentType<{
    data: ClientPresentationData;
    speakerNotes?: string;
    className?: string;
  }>;
  speakerNotes?: string;
}

export const DEFAULT_SCREEN_ORDER: ScreenConfig[] = [
  {
    id: "overview",
    label: "Overview",
    component: TitleOverviewScreen,
    speakerNotes: "Introduce the client and review date.",
  },
  {
    id: "allocation",
    label: "Allocation",
    component: AllocationScreen,
    speakerNotes: "Walk through current portfolio allocation.",
  },
  {
    id: "performance",
    label: "Performance",
    component: PerformanceScreen,
    speakerNotes: "Review performance over key periods.",
  },
  {
    id: "summary",
    label: "Summary",
    component: SummaryScreen,
    speakerNotes: "Summarize highlights and next steps.",
  },
];
