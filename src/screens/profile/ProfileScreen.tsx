import React from "react";
import { Alert, Text, View } from "react-native";
import { Screen } from "../../components/Screen";
import { TextField } from "../../components/TextField";
import { PrimaryButton } from "../../components/PrimaryButton";
import { useAppState } from "../../state/AppState";
import { setDisplayName } from "../../services/profile";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase";

export function ProfileScreen() {
  const { uid, profile } = useAppState();
  const [name, setName] = React.useState(profile?.displayName ?? "");
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => setName(profile?.displayName ?? ""), [profile?.displayName]);

  async function save() {
    if (!uid) return;
    try {
      setSaving(true);
      await setDisplayName(uid, name);
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? String(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen>
      <View style={{ gap: 6 }}>
        <Text style={{ fontSize: 18, fontWeight: "800" }}>Perfil</Text>
        <Text style={{ color: "#6B7280" }}>Tu ID: {uid ?? "-"}</Text>
      </View>

      <TextField label="Nombre de perfil" value={name} onChangeText={setName} placeholder="Tu nombre" />
      <PrimaryButton title="Guardar nombre" onPress={save} loading={saving} disabled={!uid} />

      <PrimaryButton
        title="Cerrar sesión"
        onPress={() => signOut(auth)}
        style={{ backgroundColor: "#991B1B" }}
      />
    </Screen>
  );
}
