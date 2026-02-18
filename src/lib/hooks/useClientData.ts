"use client";

import { useState, useEffect } from "react";
import type { Client, ClientPresentationData, ClientDashboardData } from "@/types";
import {
  getClientById,
  getClientPresentationData,
  getClientDashboardData,
} from "@/lib/data";

export function useClientData(clientId: string | null): {
  client: Client | null;
  data: ClientPresentationData | null;
  dashboard: ClientDashboardData | null;
  loading: boolean;
  error: Error | null;
} {
  const [client, setClient] = useState<Client | null>(null);
  const [data, setData] = useState<ClientPresentationData | null>(null);
  const [dashboard, setDashboard] = useState<ClientDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!clientId) {
      setClient(null);
      setData(null);
      setDashboard(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const clientResult = getClientById(clientId);
      const dataResult = getClientPresentationData(clientId);
      const dashboardResult = getClientDashboardData(clientId);
      setClient(clientResult ?? null);
      setData(dataResult ?? null);
      setDashboard(dashboardResult ?? null);
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
      setClient(null);
      setData(null);
      setDashboard(null);
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  return { client, data, dashboard, loading, error };
}
