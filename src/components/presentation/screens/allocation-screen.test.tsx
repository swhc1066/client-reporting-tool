import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AllocationScreen } from "./allocation-screen";
import type { ClientPresentationData } from "@/types";

const withAllocation: ClientPresentationData = {
  allocation: {
    items: [
      { label: "Equities", value: 60 },
      { label: "Fixed income", value: 25 },
      { label: "Cash", value: 5 },
    ],
    total: 100,
  },
};

const emptyAllocation: ClientPresentationData = {
  allocation: { items: [], total: 0 },
};

const noAllocation: ClientPresentationData = {};

describe("AllocationScreen", () => {
  it("renders allocation items and total", () => {
    render(<AllocationScreen data={withAllocation} />);
    expect(
      screen.getByRole("heading", { name: "Allocation" })
    ).toBeInTheDocument();
    expect(screen.getByText("Equities")).toBeInTheDocument();
    expect(screen.getByText("60%")).toBeInTheDocument();
    expect(screen.getByText(/Total: 100%/)).toBeInTheDocument();
  });

  it("shows empty state when items array is empty", () => {
    render(<AllocationScreen data={emptyAllocation} />);
    expect(
      screen.getByText(/No allocation data available for this client/)
    ).toBeInTheDocument();
  });

  it("handles missing allocation without throwing", () => {
    const { container } = render(<AllocationScreen data={noAllocation} />);
    expect(container.textContent).toContain(
      "No allocation data available for this client"
    );
  });
});
