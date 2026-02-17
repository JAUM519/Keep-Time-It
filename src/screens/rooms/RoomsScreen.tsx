import React from "react";
import { Alert, FlatList, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { User } from "firebase/auth";
import { Screen } from "../../components/Screen";
import { ListItem } from "../../components/ListItem";
import { PrimaryButton } from "../../components/PrimaryButton";
import { listenAuthState } from "../../services/auth";
import { subscribeRooms } from "../../services/rooms";
import { Room } from "../../types/models";
import { RoomsStackParamList } from "../../navigation/types";

type Nav = NativeStackNavigationProp<RoomsStackParamList, "Rooms">;

export function RoomsScreen() {
  const navigation = useNavigation<Nav>();
  const [uid, setUid] = React.useState<string | null>(null);
  const [rooms, setRooms] = React.useState<Room[]>([]);

  React.useEffect(() => {
    let unsubRooms: (() => void) | null = null;

    const unsubAuth = listenAuthState((user: User | null) => {
      setUid(user?.uid ?? null);

      // reset rooms when auth changes
      setRooms([]);

      unsubRooms?.();
      unsubRooms = null;

      if (user?.uid) {
        unsubRooms = subscribeRooms(
          user.uid,
          (data) => setRooms(data),
          (e) => Alert.alert("Error", String(e))
        );
      }
    });

    return () => {
      unsubRooms?.();
      unsubAuth();
    };
  }, []);

  return (
    <Screen>
      <PrimaryButton title="Crear habitación" onPress={() => navigation.navigate("AddRoom")} />

      <View style={{ gap: 6 }}>
        <Text style={{ fontSize: 16, fontWeight: "800" }}>Tus habitaciones</Text>
        <Text style={{ fontSize: 13, color: "#6B7280" }}>
          {uid ? "Conectado" : "Sin sesión"}
        </Text>
      </View>

      <FlatList
        data={rooms}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 10, paddingBottom: 24 }}
        ListEmptyComponent={
          <Text style={{ color: "#6B7280" }}>
            Aún no tienes habitaciones. Crea la primera.
          </Text>
        }
        renderItem={({ item }) => (
          <ListItem
            title={item.name}
            subtitle="Toca para ver dispositivos"
            onPress={() => navigation.navigate("RoomDetail", { roomId: item.id, roomName: item.name })}
          />
        )}
      />
    </Screen>
  );
}
