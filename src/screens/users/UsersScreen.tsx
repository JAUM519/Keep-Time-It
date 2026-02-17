import React from "react";
import { Alert, FlatList, Text } from "react-native";
import { Screen } from "../../components/Screen";
import { TextField } from "../../components/TextField";
import { PrimaryButton } from "../../components/PrimaryButton";
import { ListItem } from "../../components/ListItem";
import { useAppState } from "../../state/AppState";
import { subscribeMembers } from "../../services/members";
import { sendInvite } from "../../services/invites";
import { HomeMember } from "../../types/kti";

export function UsersScreen() {
  const { homeId, uid } = useAppState();
  const [members, setMembers] = React.useState<HomeMember[]>([]);
  const [toUid, setToUid] = React.useState("");
  const [sending, setSending] = React.useState(false);

  React.useEffect(() => {
    if (!homeId) return;
    return subscribeMembers(homeId, setMembers);
  }, [homeId]);

  async function invite() {
    if (!homeId || !uid) return;
    try {
      setSending(true);
      await sendInvite({ homeId, fromUid: uid, toUid: toUid.trim() });
      setToUid("");
      Alert.alert("Listo", "Invitación enviada.");
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? String(e));
    } finally {
      setSending(false);
    }
  }

  if (!homeId) {
    return (
      <Screen>
        <Text style={{ color: "#6B7280" }}>No estás en un hogar.</Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <Text style={{ fontSize: 16, fontWeight: "800" }}>Usuarios del hogar</Text>

      <TextField label="Invitar por ID (uid)" value={toUid} onChangeText={setToUid} placeholder="Pega el ID del usuario" />
      <PrimaryButton title="Enviar invitación" onPress={invite} loading={sending} disabled={!uid} />

      <FlatList
        data={members}
        keyExtractor={(m) => m.uid}
        contentContainerStyle={{ gap: 10, paddingBottom: 24 }}
        renderItem={({ item }) => <ListItem title={item.displayName} subtitle={item.uid} />}
      />
    </Screen>
  );
}
