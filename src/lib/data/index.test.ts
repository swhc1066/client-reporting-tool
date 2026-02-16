import { describe, it, expect } from "vitest";
import {
  getClients,
  getClientById,
  getClientPresentationData,
} from "./index";
import type { Client, ClientPresentationData } from "@/types";

describe("data layer", () => {
  describe("getClients", () => {
    it("returns an array of clients with id, name, and optional identifier", () => {
      const clients = getClients();
      expect(Array.isArray(clients)).toBe(true);
      expect(clients.length).toBeGreaterThanOrEqual(1);
      for (const c of clients) {
        expect(c).toHaveProperty("id");
        expect(typeof c.id).toBe("string");
        expect(c).toHaveProperty("name");
        expect(typeof c.name).toBe("string");
        if (c.identifier !== undefined) {
          expect(typeof c.identifier).toBe("string");
        }
      }
    });

    it("returns a new array each call", () => {
      const a = getClients();
      const b = getClients();
      expect(a).not.toBe(b);
    });
  });

  describe("getClientById", () => {
    it("returns client when id exists", () => {
      const client = getClientById("client-1");
      expect(client).toBeDefined();
      expect((client as Client).id).toBe("client-1");
      expect((client as Client).name).toBeDefined();
    });

    it("returns undefined when id does not exist", () => {
      expect(getClientById("nonexistent")).toBeUndefined();
    });
  });

  describe("getClientPresentationData", () => {
    it("returns data with optional overview, allocation, performance, summary", () => {
      const data = getClientPresentationData("client-1");
      expect(data).toBeDefined();
      const d = data as ClientPresentationData;
      if (d.overview != null) {
        expect(typeof d.overview).toBe("object");
        if (d.overview.clientName != null)
          expect(typeof d.overview.clientName).toBe("string");
      }
      if (d.allocation != null) {
        expect(typeof d.allocation).toBe("object");
        if (d.allocation.items != null) {
          expect(Array.isArray(d.allocation.items)).toBe(true);
          for (const item of d.allocation.items) {
            expect(item).toHaveProperty("label");
            expect(item).toHaveProperty("value");
          }
        }
      }
      if (d.performance != null) {
        if (d.performance.items != null) {
          expect(Array.isArray(d.performance.items)).toBe(true);
          for (const item of d.performance.items) {
            expect(item).toHaveProperty("period");
            expect(item).toHaveProperty("return");
          }
        }
      }
      if (d.summary != null && d.summary.highlights != null) {
        expect(Array.isArray(d.summary.highlights)).toBe(true);
      }
    });

    it("returns undefined when clientId has no data", () => {
      expect(getClientPresentationData("no-data-id")).toBeUndefined();
    });
  });
});
