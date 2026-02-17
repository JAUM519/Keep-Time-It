import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RoomsStackParamList } from "../types";
import { RoomsScreen } from "../../screens/rooms/RoomsScreen";
import { AddRoomScreen } from "../../screens/rooms/AddRoomScreen";
import { RoomDetailScreen } from "../../screens/rooms/RoomDetailScreen";
import { AddDeviceScreen } from "../../screens/devices/AddDeviceScreen";
import { DeviceDetailScreen } from "../../screens/devices/DeviceDetailScreen";

const Stack = createNativeStackNavigator<RoomsStackParamList>();

export function RoomsStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerTitleStyle: { fontWeight: "700" } }}>
      <Stack.Screen name="Rooms" component={RoomsScreen} options={{ title: "Habitaciones" }} />
      <Stack.Screen name="AddRoom" component={AddRoomScreen} options={{ title: "Nueva habitación" }} />
      <Stack.Screen
        name="RoomDetail"
        component={RoomDetailScreen}
        options={({ route }) => ({ title: route.params.roomName })}
      />
      <Stack.Screen
        name="AddDevice"
        component={AddDeviceScreen}
        options={{ title: "Nuevo dispositivo" }}
      />
      <Stack.Screen
        name="DeviceDetail"
        component={DeviceDetailScreen}
        options={({ route }) => ({ title: route.params.deviceName })}
      />
    </Stack.Navigator>
  );
}
