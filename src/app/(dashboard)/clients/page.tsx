"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useClients } from "@/lib/hooks/useClients";
import type { Client } from "@/types";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

function filterClients(clients: Client[], query: string): Client[] {
  if (!query.trim()) return clients;
  const q = query.trim().toLowerCase();
  return clients.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      (c.identifier?.toLowerCase().includes(q) ?? false)
  );
}

function ClientListSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="mt-2 h-4 w-1/2" />
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

function ClientCard({ client }: { client: Client }) {
  return (
    <Link href={`/clients/${client.id}/present`}>
      <Card className="transition-colors hover:bg-accent/50 focus-within:ring-2 focus-within:ring-ring">
        <CardHeader>
          <CardTitle className="text-base">{client.name}</CardTitle>
          {client.identifier && (
            <CardDescription>{client.identifier}</CardDescription>
          )}
        </CardHeader>
      </Card>
    </Link>
  );
}

export default function ClientsPage() {
  const { clients, loading, error } = useClients();
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () => (clients ? filterClients(clients, search) : []),
    [clients, search]
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
            Clients
          </h1>
          <p className="text-muted-foreground">
            Select a client to view their presentation.
          </p>
        </div>
        <ClientListSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6" role="alert" aria-live="assertive">
        <div>
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
            Clients
          </h1>
        </div>
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-destructive">
              Error loading clients
            </CardTitle>
            <CardDescription>{error.message}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Clients
        </h1>
        <p className="text-muted-foreground">
          Select a client to view their presentation.
        </p>
      </div>

      {clients && clients.length > 0 && (
        <div className="max-w-sm">
          <label htmlFor="client-search" className="sr-only">
            Search clients by name or identifier
          </label>
          <Input
            id="client-search"
            type="search"
            placeholder="Search by name or identifier..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search clients by name or identifier"
            className="max-w-sm"
          />
        </div>
      )}

      {!clients || clients.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No clients</CardTitle>
            <CardDescription>
              There are no clients to display. Add clients to get started.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : filtered.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No matches</CardTitle>
            <CardDescription>
              No clients match &quot;{search}&quot;. Try a different search.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))}
        </div>
      )}
    </div>
  );
}
