import React from "react";
import { Text } from "react-native";
import { Screen } from "../../components/Screen";
import { PrimaryButton } from "../../components/PrimaryButton";
import { useAppState } from "../../state/AppState";
import { useNavigation } from "@react-navigation/native";

export function EditorEntryScreen() {
  const nav = useNavigation<any>();
  const { editorMode, setEditorMode } = useAppState();

  if (editorMode) {
    return (
      <Screen>
        <Text style={{ fontSize: 16, fontWeight: "800" }}>Modo editor</Text>
        <Text style={{ color: "#6B7280" }}>Estás en modo editor.</Text>

        <PrimaryButton
          title="Ir al editor"
          onPress={() => nav.navigate("EditorRooms")}
        />
        <PrimaryButton
          title="Salir (volver a usuario)"
          onPress={() => {
            setEditorMode(false);
            nav.navigate("Habitaciones");
          }}
          style={{ backgroundColor: "#374151" }}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <Text style={{ fontSize: 16, fontWeight: "800" }}>Entrar a modo editor</Text>
      <Text style={{ color: "#6B7280" }}>
        En modo editor puedes agregar/eliminar/renombrar habitaciones e ítems.
      </Text>

      <PrimaryButton
        title="Sí, entrar"
        onPress={() => {
          setEditorMode(true);
          nav.navigate("EditorRooms");
        }}
      />
      <PrimaryButton
        title="No"
        onPress={() => nav.navigate("Habitaciones")}
        style={{ backgroundColor: "#374151" }}
      />
    </Screen>
  );
}
