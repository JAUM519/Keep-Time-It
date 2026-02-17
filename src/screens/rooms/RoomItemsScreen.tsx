import React from "react";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import { Screen } from "../../components/Screen";
import { msToHMS } from "../../utils/time";
import { useAppState } from "../../state/AppState";
import { subscribeItems, toggleItem } from "../../services/items";
import { Item } from "../../types/kti";

export function RoomItemsScreen({ route }: any) {
  const { roomId, roomName } = route.params as { roomId: string; roomName: string };
  const { uid, homeId } = useAppState();

  const [items, setItems] = React.useState<Item[]>([]);
  const [tick, setTick] = React.useState(0);

  React.useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  React.useEffect(() => {
    if (!homeId) return;
    return subscribeItems(homeId, roomId, setItems);
  }, [homeId, roomId]);

  function displayMs(it: Item) {
    const base = it.totalMs ?? 0;
    const a = it.activeSession;
    if (!a?.startedAt?.toMillis) return base;
    void tick;
    return base + Math.max(0, Date.now() - a.startedAt.toMillis());
  }

  async function onToggle(it: Item) {
    if (!uid || !homeId) return;
    try {
      await toggleItem({
        homeId,
        roomId,
        roomName,
        itemId: it.id,
        itemName: it.name,
        kind: it.kind,
        uid,
      });
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? String(e));
    }
  }

  return (
    <Screen>
      <Text style={{ fontSize: 16, fontWeight: "800" }}>{roomName}</Text>

      <FlatList
        data={[...items].sort((a, b) => (a.activeSession ? -1 : 1) - (b.activeSession ? -1 : 1))}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ gap: 10, paddingBottom: 24 }}
        ListEmptyComponent={<Text style={{ color: "#6B7280" }}>No hay ítems. Agrega desde Editor.</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => onToggle(item)}
            style={{ borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 14, padding: 12, gap: 6 }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontWeight: "800" }}>{item.name}</Text>
              <Text style={{ fontWeight: "800" }}>{msToHMS(displayMs(item))}</Text>
            </View>
            <Text style={{ color: "#6B7280" }}>{item.kind}</Text>
            {item.activeSession ? (
              <Text style={{ fontWeight: "800" }}>ACTIVO</Text>
            ) : (
              <Text style={{ color: "#6B7280" }}>Inactivo (toca para iniciar)</Text>
            )}
          </TouchableOpacity>
        )}
      />
    </Screen>
  );
}
