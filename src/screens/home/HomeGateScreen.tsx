import React from "react";
import { Alert, FlatList, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Screen } from "../../components/Screen";
import { PrimaryButton } from "../../components/PrimaryButton";
import { ListItem } from "../../components/ListItem";
import { useAppState } from "../../state/AppState";
import { subscribeInvitesForUser, acceptInvite, declineInvite } from "../../services/invites";
import { Invite } from "../../types/kti";

export function HomeGateScreen() {
  const nav = useNavigation<any>();
  const { uid, profile } = useAppState();
  const [invites, setInvites] = React.useState<Invite[]>([]);

  React.useEffect(() => {
    if (!uid) return;
    return subscribeInvitesForUser(uid, (list) => setInvites(list));
  }, [uid]);

  const pending = invites.filter((i) => i.status === "pending");

  return (
    <Screen>
      <View style={{ gap: 6 }}>
        <Text style={{ fontSize: 18, fontWeight: "800" }}>Hogar</Text>
        <Text style={{ color: "#6B7280" }}>
          Tu ID (para que te inviten): {uid ?? "-"}
        </Text>
      </View>

      <PrimaryButton title="Crear hogar" onPress={() => nav.navigate("CreateHome")} />
      <PrimaryButton title="Unirse a hogar" onPress={() => nav.navigate("JoinHome")} style={{ backgroundColor: "#374151" }} />

      <View style={{ height: 1, backgroundColor: "#E5E7EB" }} />

      <Text style={{ fontSize: 16, fontWeight: "800" }}>Invitaciones</Text>

      <FlatList
        data={pending}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ gap: 10, paddingBottom: 24 }}
        ListEmptyComponent={<Text style={{ color: "#6B7280" }}>No tienes invitaciones pendientes.</Text>}
        renderItem={({ item }) => (
          <ListItem
            title={`Hogar: ${item.homeId}`}
            subtitle={`De: ${item.fromUid}`}
            onPress={async () => {
              if (!uid || !profile) return;
              Alert.alert("Invitación", "¿Aceptar invitación?", [
                { text: "Declinar", style: "destructive", onPress: () => declineInvite({ inviteId: item.id, uid }) },
                {
                  text: "Aceptar",
                  onPress: async () => {
                    await acceptInvite({ inviteId: item.id, uid, displayName: profile.displayName || "Usuario" });
                  },
                },
                { text: "Cancelar", style: "cancel" },
              ]);
            }}
          />
        )}
      />
    </Screen>
  );
}
