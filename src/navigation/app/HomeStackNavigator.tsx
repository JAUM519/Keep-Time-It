import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../types";
import { HomeGateScreen } from "../../screens/home/HomeGateScreen";
import { CreateHomeScreen } from "../../screens/home/CreateHomeScreen";
import { JoinHomeScreen } from "../../screens/home/JoinHomeScreen";

const Stack = createNativeStackNavigator<HomeStackParamList>();

export function HomeStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerTitleStyle: { fontWeight: "700" } }}>
      <Stack.Screen name="HomeGate" component={HomeGateScreen} options={{ title: "Hogar" }} />
      <Stack.Screen name="CreateHome" component={CreateHomeScreen} options={{ title: "Crear hogar" }} />
      <Stack.Screen name="JoinHome" component={JoinHomeScreen} options={{ title: "Unirse a hogar" }} />
    </Stack.Navigator>
  );
}
