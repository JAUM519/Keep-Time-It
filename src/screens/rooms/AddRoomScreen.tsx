import React from "react";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Screen } from "../../components/Screen";
import { TextField } from "../../components/TextField";
import { PrimaryButton } from "../../components/PrimaryButton";
import { listenAuthState } from "../../services/auth";
import { createRoom } from "../../services/rooms";
import { RoomsStackParamList } from "../../navigation/types";

type Nav = NativeStackNavigationProp<RoomsStackParamList, "AddRoom">;

export function AddRoomScreen() {
  const navigation = useNavigation<Nav>();
  const [uid, setUid] = React.useState<string | null>(null);
  const [name, setName] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => listenAuthState((u) => setUid(u?.uid ?? null)), []);

  async function save() {
    if (!uid) return;
    try {
      setSaving(true);
      await createRoom(uid, name);
      navigation.goBack();
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? String(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen>
      <TextField label="Nombre de la habitación" value={name} onChangeText={setName} placeholder="Ej: Cocina" />
      <PrimaryButton title="Guardar" onPress={save} loading={saving} disabled={!uid} />
    </Screen>
  );
}
