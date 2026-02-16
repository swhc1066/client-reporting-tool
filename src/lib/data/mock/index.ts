import type { Client, ClientPresentationData } from "@/types";
import { mockClients } from "./clients";
import { mockClientData } from "./clientData";

export function getClients(): Client[] {
  return [...mockClients];
}

export function getClientById(id: string): Client | undefined {
  return mockClients.find((c) => c.id === id);
}

export function getClientPresentationData(
  clientId: string
): ClientPresentationData | undefined {
  return mockClientData[clientId];
}
