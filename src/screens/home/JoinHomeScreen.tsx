import React from "react";
import { Alert, Text } from "react-native";
import { Screen } from "../../components/Screen";
import { TextField } from "../../components/TextField";
import { PrimaryButton } from "../../components/PrimaryButton";
import { useAppState } from "../../state/AppState";
import { joinHome } from "../../services/homes";

export function JoinHomeScreen() {
  const { uid, profile } = useAppState();
  const [homeId, setHomeId] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function go() {
    if (!uid || !profile) return;
    try {
      setLoading(true);
      await joinHome({ uid, displayName: profile.displayName || "Usuario", homeId: homeId.trim() });
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <Text style={{ fontSize: 16, fontWeight: "800" }}>Unirse a un hogar</Text>
      <TextField label="Home ID" value={homeId} onChangeText={setHomeId} placeholder="Pega el ID del hogar" />
      <PrimaryButton title="Unirse" onPress={go} loading={loading} disabled={!uid} />
    </Screen>
  );
}
