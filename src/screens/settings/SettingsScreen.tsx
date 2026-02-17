import React from "react";
import { Alert, Text, View } from "react-native";
import { Screen } from "../../components/Screen";
import { PrimaryButton } from "../../components/PrimaryButton";
import { listenAuthState, signOut } from "../../services/auth";

export function SettingsScreen() {
  const [phone, setPhone] = React.useState<string | null>(null);

  React.useEffect(() => listenAuthState((u) => setPhone(u?.phoneNumber ?? null)), []);

  return (
    <Screen>
      <View style={{ gap: 8 }}>
        <Text style={{ fontSize: 16, fontWeight: "800" }}>Cuenta</Text>
        <Text style={{ color: "#6B7280" }}>{phone ?? "Sin número"}</Text>
      </View>

      <PrimaryButton
        title="Cerrar sesión"
        onPress={async () => {
          try {
            await signOut();
          } catch (e: any) {
            Alert.alert("Error", e?.message ?? String(e));
          }
        }}
      />
    </Screen>
  );
}
