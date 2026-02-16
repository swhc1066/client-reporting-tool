"use client";

import { useState, useEffect } from "react";
import type { Client, ClientPresentationData } from "@/types";
import { getClientById, getClientPresentationData } from "@/lib/data";

export function useClientData(clientId: string | null): {
  client: Client | null;
  data: ClientPresentationData | null;
  loading: boolean;
  error: Error | null;
} {
  const [client, setClient] = useState<Client | null>(null);
  const [data, setData] = useState<ClientPresentationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!clientId) {
      setClient(null);
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const clientResult = getClientById(clientId);
      const dataResult = getClientPresentationData(clientId);
      setClient(clientResult ?? null);
      setData(dataResult ?? null);
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
      setClient(null);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  return { client, data, loading, error };
}
