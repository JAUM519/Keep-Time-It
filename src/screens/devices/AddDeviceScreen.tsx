import React from "react";
import { Alert, FlatList, Text, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";
import { Screen } from "../../components/Screen";
import { TextField } from "../../components/TextField";
import { PrimaryButton } from "../../components/PrimaryButton";
import { ListItem } from "../../components/ListItem";
import { DEVICE_CATALOG } from "../../data/deviceCatalog";
import { listenAuthState } from "../../services/auth";
import { createDevice } from "../../services/devices";
import { RoomsStackParamList } from "../../navigation/types";
import { ResourceType } from "../../types/models";

type Nav = NativeStackNavigationProp<RoomsStackParamList, "AddDevice">;
type Rt = RouteProp<RoomsStackParamList, "AddDevice">;

export function AddDeviceScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Rt>();
  const { roomId } = route.params;

  const [uid, setUid] = React.useState<string | null>(null);
  const [name, setName] = React.useState("");
  const [resourceType, setResourceType] = React.useState<ResourceType>("energia");
  const [notes, setNotes] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => listenAuthState((u) => setUid(u?.uid ?? null)), []);

  async function save() {
    if (!uid) return;
    try {
      setSaving(true);
      await createDevice(uid, roomId, { name, resourceType, notes });
      navigation.goBack();
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? String(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen>
      <View style={{ gap: 8 }}>
        <Text style={{ fontSize: 16, fontWeight: "800" }}>Elegir desde catálogo</Text>
        <FlatList
          data={DEVICE_CATALOG}
          keyExtractor={(i) => i.key}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 10 }}
          renderItem={({ item }) => (
            <ListItem
              title={item.label}
              subtitle={item.resourceType}
              onPress={() => {
                setName(item.label);
                setResourceType(item.resourceType);
              }}
            />
          )}
        />
      </View>

      <TextField label="Nombre" value={name} onChangeText={setName} placeholder="Ej: Nevera" />
      <TextField
        label="Recurso (energia / agua / gas)"
        value={resourceType}
        onChangeText={(v) => setResourceType((v as ResourceType) || "energia")}
        placeholder="energia"
        autoCapitalize="none"
      />
      <TextField label="Notas (opcional)" value={notes} onChangeText={setNotes} placeholder="Ej: Modelo, potencia, etc." />

      <PrimaryButton title="Guardar" onPress={save} loading={saving} disabled={!uid} />
    </Screen>
  );
}
