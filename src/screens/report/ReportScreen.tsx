import React from "react";
import { Alert, FlatList, Text, View } from "react-native";
import { Screen } from "../../components/Screen";
import { TextField } from "../../components/TextField";
import { PrimaryButton } from "../../components/PrimaryButton";
import { useAppState } from "../../state/AppState";
import { getReport } from "../../services/report";
import { msToHMS } from "../../utils/time";

function parseISODate(s: string): Date | null {
  const t = s.trim();
  // YYYY-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(t)) return null;
  const d = new Date(`${t}T00:00:00`);
  return isNaN(d.getTime()) ? null : d;
}

export function ReportScreen() {
  const { homeId } = useAppState();
  const [from, setFrom] = React.useState("2026-02-01");
  const [to, setTo] = React.useState("2026-02-16");
  const [loading, setLoading] = React.useState(false);
  const [rows, setRows] = React.useState<{ roomName: string; itemName: string; totalMs: number }[]>([]);

  async function run() {
    if (!homeId) return;
    const d1 = parseISODate(from);
    const d2 = parseISODate(to);
    if (!d1 || !d2) {
      Alert.alert("Error", "Usa formato YYYY-MM-DD.");
      return;
    }
    if (d2.getTime() < d1.getTime()) {
      Alert.alert("Error", "La fecha final no puede ser menor a la inicial.");
      return;
    }

    // incluye todo el día final
    const end = new Date(d2);
    end.setHours(23, 59, 59, 999);

    try {
      setLoading(true);
      const res = await getReport({ homeId, from: d1, to: end });
      setRows(res);
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <Text style={{ fontSize: 16, fontWeight: "800" }}>Reporte</Text>
      <Text style={{ color: "#6B7280" }}>
        Rango: {from} → {to}
      </Text>

      <TextField label="Desde (YYYY-MM-DD)" value={from} onChangeText={setFrom} />
      <TextField label="Hasta (YYYY-MM-DD)" value={to} onChangeText={setTo} />

      <PrimaryButton title="Generar reporte" onPress={run} loading={loading} disabled={!homeId} />

      <FlatList
        data={rows}
        keyExtractor={(r) => `${r.roomName}|||${r.itemName}`}
        contentContainerStyle={{ gap: 10, paddingBottom: 24 }}
        ListEmptyComponent={<Text style={{ color: "#6B7280" }}>Sin datos en el rango.</Text>}
        renderItem={({ item }) => (
          <View style={{ borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 14, padding: 12, gap: 4 }}>
            <Text style={{ fontWeight: "800" }}>{item.roomName}</Text>
            <Text>{item.itemName}</Text>
            <Text style={{ fontWeight: "800" }}>{msToHMS(item.totalMs)}</Text>
          </View>
        )}
      />
    </Screen>
  );
}
