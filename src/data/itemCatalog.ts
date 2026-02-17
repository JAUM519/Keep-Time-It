import { ItemKind } from "../types/kti";

export type CatalogItem = { name: string; kind: ItemKind };

export const ITEM_CATALOG: CatalogItem[] = [
  // Dispositivos (general)
  { name: "Nevera", kind: "dispositivo" },
  { name: "Televisor", kind: "dispositivo" },
  { name: "Portátil", kind: "dispositivo" },
  { name: "Microondas", kind: "dispositivo" },
  { name: "Lavadora", kind: "dispositivo" },
  { name: "Ventilador", kind: "dispositivo" },
  { name: "Router de internet", kind: "dispositivo" },
  { name: "Teléfono fijo", kind: "dispositivo" },
  { name: "Tablet", kind: "dispositivo" },
  { name: "Smart Watch", kind: "dispositivo" },
  { name: "Audífonos", kind: "dispositivo" },
  { name: "Air Fryer", kind: "dispositivo" },
  { name: "Arrocera", kind: "dispositivo" },
  { name: "Licuadora", kind: "dispositivo" },
  { name: "Impresora", kind: "dispositivo" },
  { name: "Cafetera", kind: "dispositivo" },
  { name: "Aspirador de olor", kind: "dispositivo" },
  { name: "Plancha de ropa", kind: "dispositivo" },

  // “Agua” como ítems medibles (se tratan como dispositivo)
  { name: "Ducha", kind: "dispositivo" },
  { name: "Inodoro", kind: "dispositivo" },
  { name: "Lavamanos", kind: "dispositivo" },
  { name: "Lavaplatos", kind: "dispositivo" },
  { name: "Tanque de agua", kind: "dispositivo" },
  { name: "Grifo del baño", kind: "dispositivo" },
  { name: "Manguera", kind: "dispositivo" },

  // Luz
  { name: "Bombillo", kind: "luz" },

  // Conectores
  { name: "Cargador de celular", kind: "conector" },
];

export function makeConnectors(count: number): CatalogItem[] {
  const out: CatalogItem[] = [];
  for (let i = 1; i <= count; i++) out.push({ name: `Conector ${i}`, kind: "conector" });
  return out;
}
