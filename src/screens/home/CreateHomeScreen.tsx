import React from "react";
import { Alert, ScrollView, Text, TextInput, View } from "react-native";
import { Screen } from "../../components/Screen";
import { PrimaryButton } from "../../components/PrimaryButton";
import { useAppState } from "../../state/AppState";
import { createHome, CreateRoomInput } from "../../services/homes";
import { RoomType } from "../../types/kti";

const TYPES: { label: string; value: RoomType }[] = [
  { label: "Cuarto", value: "cuarto" },
  { label: "Sala", value: "sala" },
  { label: "Cocina", value: "cocina" },
  { label: "Baño", value: "bano" },
  { label: "Lavadero", value: "lavadero" },
];

export function CreateHomeScreen() {
  const { uid, profile } = useAppState();
  const [saving, setSaving] = React.useState(false);

  const [rooms, setRooms] = React.useState<CreateRoomInput[]>([
    { name: "Sala", type: "sala", isPrivate: false },
    { name: "Cocina", type: "cocina", isPrivate: false },
    { name: "Baño", type: "bano", isPrivate: false },
    { name: "Lavadero", type: "lavadero", isPrivate: false },
    { name: "Mi cuarto", type: "cuarto", isPrivate: true },
  ]);

  function setRoom(idx: number, patch: Partial<CreateRoomInput>) {
    setRooms((prev) => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
  }

  function addRoomRow() {
    setRooms((prev) => [...prev, { name: "Nueva habitación", type: "sala", isPrivate: false }]);
  }

  async function save() {
    if (!uid || !profile) return;

    const clean = rooms.map((r) => ({
      ...r,
      name: r.name.trim(),
      ownerUid: r.isPrivate ? uid : null,
    }));

    if (clean.some((r) => !r.name)) {
      Alert.alert("Error", "Todas las habitaciones deben tener nombre.");
      return;
    }

    try {
      setSaving(true);
      await createHome({ uid, displayName: profile.displayName || "Usuario", rooms: clean });
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? String(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen>
      <Text style={{ fontSize: 16, fontWeight: "800" }}>Configurar habitaciones</Text>

      <ScrollView contentContainerStyle={{ gap: 12, paddingBottom: 24 }}>
        {rooms.map((r, idx) => (
          <View key={idx} style={{ borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 12, padding: 12, gap: 10 }}>
            <Text style={{ fontWeight: "800" }}>Habitación {idx + 1}</Text>

            <TextInput
              value={r.name}
              onChangeText={(t) => setRoom(idx, { name: t })}
              placeholder="Nombre"
              style={{ borderWidth: 1, borderColor: "#E5E7EB", padding: 10, borderRadius: 10 }}
            />

            <Text style={{ fontWeight: "700" }}>Tipo</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {TYPES.map((t) => (
                <PrimaryButton
                  key={t.value}
                  title={t.label}
                  onPress={() => setRoom(idx, { type: t.value })}
                  style={{ backgroundColor: r.type === t.value ? "#111827" : "#374151", paddingHorizontal: 10, height: 40 }}
                />
              ))}
            </View>

            <PrimaryButton
              title={r.isPrivate ? "Privada (Cuarto)" : "Compartida"}
              onPress={() => setRoom(idx, { isPrivate: !r.isPrivate })}
              style={{ backgroundColor: r.isPrivate ? "#0F766E" : "#1D4ED8" }}
            />
          </View>
        ))}

        <PrimaryButton title="Agregar otra habitación" onPress={addRoomRow} style={{ backgroundColor: "#374151" }} />
        <PrimaryButton title="Crear hogar" onPress={save} loading={saving} disabled={!uid} />
      </ScrollView>
    </Screen>
  );
}
