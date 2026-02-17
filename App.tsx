import React from "react";
import { StatusBar } from "expo-status-bar";
import { RootNavigator } from "./src/navigation/RootNavigator";
import { AppStateProvider } from "./src/state/AppState";

export default function App() {
  return (
    <AppStateProvider>
      <StatusBar style="auto" />
      <RootNavigator />
    </AppStateProvider>
  );
}
