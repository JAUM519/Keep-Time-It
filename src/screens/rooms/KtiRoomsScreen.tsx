import React from "react";
import { Alert, FlatList, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Screen } from "../../components/Screen";
import { PrimaryButton } from "../../components/PrimaryButton";
import { ListItem } from "../../components/ListItem";
import { useAppState } from "../../state/AppState";
import { subscribeRooms } from "../../services/ktiRooms";
import { Room } from "../../types/kti";

export function KtiRoomsScreen() {
  const nav = useNavigation<any>();
  const { homeId } = useAppState();
  const [rooms, setRooms] = React.useState<Room[]>([]);

  React.useEffect(() => {
    if (!homeId) return;
    return subscribeRooms(homeId, setRooms);
  }, [homeId]);

  if (!homeId) {
    return (
      <Screen>
        <Text style={{ color: "#6B7280" }}>No estás en un hogar. Ve a “Hogar”.</Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <PrimaryButton title="Reporte (rango de fechas)" onPress={() => nav.navigate("Report")} />

      <View style={{ gap: 6 }}>
        <Text style={{ fontSize: 16, fontWeight: "800" }}>Habitaciones</Text>
        <Text style={{ color: "#6B7280" }}>{rooms.length} habitaciones</Text>
      </View>

      <FlatList
        data={rooms}
        keyExtractor={(r) => r.id}
        contentContainerStyle={{ gap: 10, paddingBottom: 24 }}
        renderItem={({ item }) => (
          <ListItem
            title={item.name}
            subtitle={`${item.type}${item.isPrivate ? " · privada" : " · compartida"}`}
            onPress={() => nav.navigate("RoomItems", { roomId: item.id, roomName: item.name })}
          />
        )}
      />
    </Screen>
  );
}
