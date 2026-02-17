import React from "react";
import { Alert, FlatList, Text, TextInput, View } from "react-native";
import { Screen } from "../../components/Screen";
import { PrimaryButton } from "../../components/PrimaryButton";
import { ListItem } from "../../components/ListItem";
import { useAppState } from "../../state/AppState";
import { addItem, renameItem, subscribeItems } from "../../services/items";
import { Item, ItemKind } from "../../types/kti";
import { ITEM_CATALOG, makeConnectors } from "../../data/itemCatalog";

export function EditorRoomItemsScreen({ route }: any) {
  const { roomId, roomName } = route.params as { roomId: string; roomName: string };
  const { homeId, editorMode } = useAppState();

  const [items, setItems] = React.useState<Item[]>([]);
  const [search, setSearch] = React.useState("");
  const [customName, setCustomName] = React.useState("");
  const [customKind, setCustomKind] = React.useState<ItemKind>("dispositivo");

  React.useEffect(() => {
    if (!homeId) return;
    return subscribeItems(homeId, roomId, setItems);
  }, [homeId, roomId]);

  const existing = new Set(items.map((i) => i.name.trim().toLowerCase()));

  const filteredCatalog = [...ITEM_CATALOG, ...makeConnectors(3)]
    .filter((c) => !existing.has(c.name.toLowerCase()))
    .filter((c) => (search.trim() ? c.name.toLowerCase().includes(search.trim().toLowerCase()) : true));

  if (!editorMode) {
    return (
      <Screen>
        <Text style={{ color: "#6B7280" }}>No estás en modo editor.</Text>
      </Screen>
    );
  }

  async function addFromCatalog(name: string, kind: ItemKind) {
    if (!homeId) return;
    try {
      await addItem(homeId, roomId, { name, kind });
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? String(e));
    }
  }

  async function addCustom() {
    if (!homeId) return;
    const n = customName.trim();
    if (!n) return;
    if (existing.has(n.toLowerCase())) return;

    try {
      await addItem(homeId, roomId, { name: n, kind: customKind });
      setCustomName("");
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? String(e));
    }
  }

  return (
    <Screen>
      <Text style={{ fontSize: 16, fontWeight: "800" }}>Editor · {roomName}</Text>

      <Text style={{ fontWeight: "800" }}>Agregar desde lista</Text>
      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Buscar..."
        style={{ borderWidth: 1, borderColor: "#E5E7EB", padding: 10, borderRadius: 10 }}
      />

      <FlatList
        data={filteredCatalog}
        keyExtractor={(x) => x.name}
        contentContainerStyle={{ gap: 10, paddingBottom: 10 }}
        style={{ maxHeight: 260 }}
        renderItem={({ item }) => (
          <ListItem
            title={item.name}
            subtitle={item.kind}
            onPress={() => addFromCatalog(item.name, item.kind)}
          />
        )}
      />

      <View style={{ height: 1, backgroundColor: "#E5E7EB" }} />

      <Text style={{ fontWeight: "800" }}>Agregar personalizado</Text>
      <TextInput
        value={customName}
        onChangeText={setCustomName}
        placeholder="Nombre"
        style={{ borderWidth: 1, borderColor: "#E5E7EB", padding: 10, borderRadius: 10 }}
      />

      <View style={{ flexDirection: "row", gap: 8 }}>
        <PrimaryButton title="Dispositivo" onPress={() => setCustomKind("dispositivo")} style={{ backgroundColor: customKind === "dispositivo" ? "#111827" : "#374151", height: 40 }} />
        <PrimaryButton title="Luz" onPress={() => setCustomKind("luz")} style={{ backgroundColor: customKind === "luz" ? "#111827" : "#374151", height: 40 }} />
        <PrimaryButton title="Conector" onPress={() => setCustomKind("conector")} style={{ backgroundColor: customKind === "conector" ? "#111827" : "#374151", height: 40 }} />
      </View>

      <PrimaryButton title="Agregar" onPress={addCustom} />

      <View style={{ height: 1, backgroundColor: "#E5E7EB" }} />

      <Text style={{ fontWeight: "800" }}>Ítems actuales</Text>
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ gap: 10, paddingBottom: 24 }}
        renderItem={({ item }) => (
          <ListItem
            title={item.name}
            subtitle={item.kind}
            onPress={async () => {
              if (!homeId) return;
              Alert.alert("Renombrar", "Pon el nuevo nombre en el editor (por ahora rápido):", [
                { text: "OK" },
              ]);
            }}
          />
        )}
      />
    </Screen>
  );
}
