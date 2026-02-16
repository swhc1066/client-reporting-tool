import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TitleOverviewScreen } from "./title-overview-screen";
import type { ClientPresentationData } from "@/types";

function renderAndGetContainer(data: ClientPresentationData) {
  const { container } = render(<TitleOverviewScreen data={data} />);
  return container;
}

const fullOverview: ClientPresentationData = {
  overview: {
    clientName: "Acme Holdings LLC",
    subtitle: "Portfolio review",
    asOfDate: "2025-01-31",
  },
};

const minimalOverview: ClientPresentationData = {
  overview: {},
};

const noOverview: ClientPresentationData = {};

describe("TitleOverviewScreen", () => {
  it("renders client name from overview", () => {
    render(<TitleOverviewScreen data={fullOverview} />);
    expect(
      screen.getByRole("heading", { name: "Acme Holdings LLC" })
    ).toBeInTheDocument();
  });

  it("renders subtitle when present", () => {
    const container = renderAndGetContainer(fullOverview);
    expect(container.querySelector("p")?.textContent).toContain(
      "Portfolio review"
    );
  });

  it("renders as-of date when present", () => {
    const container = renderAndGetContainer(fullOverview);
    expect(container.textContent).toMatch(/As of 2025-01-31/);
  });

  it("falls back to default title when overview is empty", () => {
    render(<TitleOverviewScreen data={minimalOverview} />);
    expect(
      screen.getByRole("heading", { name: "Client overview" })
    ).toBeInTheDocument();
  });

  it("handles missing overview without throwing", () => {
    const container = renderAndGetContainer(noOverview);
    const heading = container.querySelector("h1");
    expect(heading?.textContent).toBe("Client overview");
  });
});
