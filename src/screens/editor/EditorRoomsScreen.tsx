import React from "react";
import { Alert, FlatList, Text } from "react-native";
import { Screen } from "../../components/Screen";
import { TextField } from "../../components/TextField";
import { PrimaryButton } from "../../components/PrimaryButton";
import { ListItem } from "../../components/ListItem";
import { useAppState } from "../../state/AppState";
import { addRoom, deleteRoom, renameRoom, subscribeRooms } from "../../services/ktiRooms";
import { Room, RoomType } from "../../types/kti";
import { useNavigation } from "@react-navigation/native";

export function EditorRoomsScreen() {
  const nav = useNavigation<any>();
  const { homeId, uid, editorMode } = useAppState();
  const [rooms, setRooms] = React.useState<Room[]>([]);
  const [name, setName] = React.useState("");
  const [type, setType] = React.useState<RoomType>("sala");
  const [isPrivate, setIsPrivate] = React.useState(false);

  React.useEffect(() => {
    if (!homeId) return;
    return subscribeRooms(homeId, setRooms);
  }, [homeId]);

  if (!editorMode) {
    return (
      <Screen>
        <Text style={{ color: "#6B7280" }}>No estás en modo editor.</Text>
      </Screen>
    );
  }

  async function create() {
    if (!homeId) return;
    try {
      await addRoom(homeId, { name, type, isPrivate, ownerUid: isPrivate ? uid : null });
      setName("");
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? String(e));
    }
  }

  return (
    <Screen>
      <Text style={{ fontSize: 16, fontWeight: "800" }}>Editor · Habitaciones</Text>

      <TextField label="Nombre" value={name} onChangeText={setName} placeholder="Ej: Comedor" />
      <TextField label="Tipo (cuarto/sala/cocina/bano/lavadero)" value={type} onChangeText={(t) => setType(t as RoomType)} />
      <PrimaryButton
        title={isPrivate ? "Privada" : "Compartida"}
        onPress={() => setIsPrivate(!isPrivate)}
        style={{ backgroundColor: isPrivate ? "#0F766E" : "#1D4ED8" }}
      />
      <PrimaryButton title="Agregar habitación" onPress={create} />

      <FlatList
        data={rooms}
        keyExtractor={(r) => r.id}
        contentContainerStyle={{ gap: 10, paddingBottom: 24 }}
        renderItem={({ item }) => (
          <ListItem
            title={item.name}
            subtitle={`${item.type}${item.isPrivate ? " · privada" : " · compartida"}`}
            onPress={() => nav.navigate("EditorRoomItems", { roomId: item.id, roomName: item.name })}
            rightText="Editar ítems"
          />
        )}
      />
    </Screen>
  );
}
