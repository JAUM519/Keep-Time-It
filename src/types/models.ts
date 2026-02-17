export type ResourceType = "energia" | "agua" | "gas";

export interface Room {
  id: string;
  name: string;
  createdAt?: unknown; // serverTimestamp()
}

export interface Device {
  id: string;
  name: string;
  resourceType: ResourceType;
  roomId: string;
  notes?: string;
  createdAt?: unknown; // serverTimestamp()
}

export interface DeviceCatalogItem {
  key: string;
  label: string;
  resourceType: ResourceType;
}
