import React from "react";
import { Alert, FlatList, Text, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";
import { Screen } from "../../components/Screen";
import { ListItem } from "../../components/ListItem";
import { PrimaryButton } from "../../components/PrimaryButton";
import { listenAuthState } from "../../services/auth";
import { subscribeDevices } from "../../services/devices";
import { Device } from "../../types/models";
import { RoomsStackParamList } from "../../navigation/types";

type Nav = NativeStackNavigationProp<RoomsStackParamList, "RoomDetail">;
type Rt = RouteProp<RoomsStackParamList, "RoomDetail">;

export function RoomDetailScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Rt>();

  const { roomId } = route.params;

  const [uid, setUid] = React.useState<string | null>(null);
  const [devices, setDevices] = React.useState<Device[]>([]);

  React.useEffect(() => {
    let unsubDevices: (() => void) | null = null;
    const unsubAuth = listenAuthState((u) => {
      setUid(u?.uid ?? null);
      setDevices([]);
      unsubDevices?.();
      unsubDevices = null;

      if (u?.uid) {
        unsubDevices = subscribeDevices(
          u.uid,
          roomId,
          (data) => setDevices(data),
          (e) => Alert.alert("Error", String(e))
        );
      }
    });

    return () => {
      unsubDevices?.();
      unsubAuth();
    };
  }, [roomId]);

  return (
    <Screen>
      <PrimaryButton title="Agregar dispositivo" onPress={() => navigation.navigate("AddDevice", { roomId })} />

      <View style={{ gap: 6 }}>
        <Text style={{ fontSize: 16, fontWeight: "800" }}>Dispositivos</Text>
        <Text style={{ fontSize: 13, color: "#6B7280" }}>
          {devices.length} en esta habitación
        </Text>
      </View>

      <FlatList
        data={devices}
        keyExtractor={(d) => d.id}
        contentContainerStyle={{ gap: 10, paddingBottom: 24 }}
        ListEmptyComponent={<Text style={{ color: "#6B7280" }}>Aún no hay dispositivos aquí.</Text>}
        renderItem={({ item }) => (
          <ListItem
            title={item.name}
            subtitle={`Recurso: ${item.resourceType}`}
            onPress={() =>
              navigation.navigate("DeviceDetail", { roomId, deviceId: item.id, deviceName: item.name })
            }
          />
        )}
      />
    </Screen>
  );
}
