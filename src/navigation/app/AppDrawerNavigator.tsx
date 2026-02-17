import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { AppDrawerParamList } from "../types";
import { HomeStackNavigator } from "./HomeStackNavigator";
import { HabitacionesStackNavigator } from "./HabitacionesStackNavigator";
import { EditorStackNavigator } from "./EditorStackNavigator";
import { UsersScreen } from "../../screens/users/UsersScreen";
import { ProfileScreen } from "../../screens/profile/ProfileScreen";

const Drawer = createDrawerNavigator<AppDrawerParamList>();

export function AppDrawerNavigator() {
  return (
    <Drawer.Navigator screenOptions={{ headerTitleStyle: { fontWeight: "700" } }}>
      <Drawer.Screen name="Hogar" component={HomeStackNavigator} />
      <Drawer.Screen name="Habitaciones" component={HabitacionesStackNavigator} />
      <Drawer.Screen name="Editor" component={EditorStackNavigator} />
      <Drawer.Screen name="Usuarios" component={UsersScreen} />
      <Drawer.Screen name="Perfil" component={ProfileScreen} />
    </Drawer.Navigator>
  );
}
