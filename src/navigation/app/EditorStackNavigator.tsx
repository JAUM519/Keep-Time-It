import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { EditorStackParamList } from "../types";
import { EditorEntryScreen } from "../../screens/editor/EditorEntryScreen";
import { EditorRoomsScreen } from "../../screens/editor/EditorRoomsScreen";
import { EditorRoomItemsScreen } from "../../screens/editor/EditorRoomItemsScreen";

const Stack = createNativeStackNavigator<EditorStackParamList>();

export function EditorStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerTitleStyle: { fontWeight: "700" } }}>
      <Stack.Screen name="EditorEntry" component={EditorEntryScreen} options={{ title: "Editor" }} />
      <Stack.Screen name="EditorRooms" component={EditorRoomsScreen} options={{ title: "Editor · Habitaciones" }} />
      <Stack.Screen
        name="EditorRoomItems"
        component={EditorRoomItemsScreen}
        options={({ route }) => ({ title: `Editor · ${route.params.roomName}` })}
      />
    </Stack.Navigator>
  );
}
