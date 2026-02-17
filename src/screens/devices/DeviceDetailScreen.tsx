import React from "react";
import { Alert, Text, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";
import { Screen } from "../../components/Screen";
import { TextField } from "../../components/TextField";
import { PrimaryButton } from "../../components/PrimaryButton";
import { listenAuthState } from "../../services/auth";
import { deleteDevice, updateDevice } from "../../services/devices";
import { RoomsStackParamList } from "../../navigation/types";

type Nav = NativeStackNavigationProp<RoomsStackParamList, "DeviceDetail">;
type Rt = RouteProp<RoomsStackParamList, "DeviceDetail">;

export function DeviceDetailScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Rt>();
  const { roomId, deviceId, deviceName } = route.params;

  const [uid, setUid] = React.useState<string | null>(null);
  const [name, setName] = React.useState(deviceName);
  const [notes, setNotes] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  React.useEffect(() => listenAuthState((u) => setUid(u?.uid ?? null)), []);

  async function save() {
    if (!uid) return;
    try {
      setSaving(true);
      await updateDevice(uid, roomId, deviceId, { name, notes });
      navigation.setParams({ deviceName: name.trim() || deviceName });
      Alert.alert("Listo", "Dispositivo actualizado.");
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? String(e));
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!uid) return;
    Alert.alert("Eliminar", "¿Eliminar este dispositivo?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            setDeleting(true);
            await deleteDevice(uid, roomId, deviceId);
            navigation.goBack();
          } catch (e: any) {
            Alert.alert("Error", e?.message ?? String(e));
          } finally {
            setDeleting(false);
          }
        },
      },
    ]);
  }

  return (
    <Screen>
      <View style={{ gap: 8 }}>
        <Text style={{ fontSize: 16, fontWeight: "800" }}>Editar</Text>
      </View>

      <TextField label="Nombre" value={name} onChangeText={setName} />
      <TextField label="Notas" value={notes} onChangeText={setNotes} placeholder="Opcional" />

      <PrimaryButton title="Guardar cambios" onPress={save} loading={saving} disabled={!uid} />
      <PrimaryButton
        title="Eliminar dispositivo"
        onPress={remove}
        loading={deleting}
        disabled={!uid}
        style={{ backgroundColor: "#991B1B" }}
      />
    </Screen>
  );
}
