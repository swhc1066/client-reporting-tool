"use client";

import { useState, useEffect } from "react";
import type { Client } from "@/types";
import { getClients } from "@/lib/data";

export function useClients(): {
  clients: Client[] | null;
  loading: boolean;
  error: Error | null;
} {
  const [clients, setClients] = useState<Client[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    try {
      const data = getClients();
      setClients(data);
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setLoading(false);
    }
  }, []);

  return { clients, loading, error };
}
