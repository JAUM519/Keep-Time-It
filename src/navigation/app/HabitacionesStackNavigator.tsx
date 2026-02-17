import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HabitacionesStackParamList } from "../types";
import { KtiRoomsScreen } from "../../screens/rooms/KtiRoomsScreen";
import { RoomItemsScreen } from "../../screens/rooms/RoomItemsScreen";
import { ReportScreen } from "../../screens/report/ReportScreen";

const Stack = createNativeStackNavigator<HabitacionesStackParamList>();

export function HabitacionesStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerTitleStyle: { fontWeight: "700" } }}>
      <Stack.Screen name="Rooms" component={KtiRoomsScreen} options={{ title: "Habitaciones" }} />
      <Stack.Screen
        name="RoomItems"
        component={RoomItemsScreen}
        options={({ route }) => ({ title: route.params.roomName })}
      />
      <Stack.Screen name="Report" component={ReportScreen} options={{ title: "Reporte" }} />
    </Stack.Navigator>
  );
}
