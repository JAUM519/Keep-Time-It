export type RoomType = "cuarto" | "sala" | "cocina" | "bano" | "lavadero";
export type ItemKind = "dispositivo" | "luz" | "conector";

export type InviteStatus = "pending" | "accepted" | "declined" | "cancelled";

export interface UserProfile {
  uid: string;
  displayName: string;
  phoneNumber?: string | null;
  homeId?: string | null;
}

export interface HomeMember {
  uid: string;
  displayName: string;
  role: "owner" | "member";
  joinedAt?: unknown;
}

export interface Room {
  id: string;
  name: string;
  type: RoomType;
  isPrivate: boolean;
  ownerUid?: string | null;
  createdAt?: unknown;
}

export interface Item {
  id: string;
  name: string;
  kind: ItemKind;
  totalMs: number;
  activeSession: null | {
    startedAt: any; // Firebase Timestamp
    startedByUid: string;
  };
  updatedAt?: unknown;
  createdAt?: unknown;
}

export interface Invite {
  id: string;
  homeId: string;
  fromUid: string;
  toUid: string;
  status: InviteStatus;
  createdAt?: unknown;
  respondedAt?: unknown;
}

export interface SessionRow {
  id: string;
  roomId: string;
  roomName: string;
  itemId: string;
  itemName: string;
  kind: ItemKind;
  startedAt: any;
  endedAt: any;
  durationMs: number;
  startedByUid: string;
  endedByUid: string;
}
