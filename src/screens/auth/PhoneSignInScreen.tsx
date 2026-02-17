import React, { useRef, useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { auth, firebaseConfig } from "../../config/firebase";
import { isValidPhoneE164, normalizePhone } from "../../utils/validators";

export default function PhoneSignInScreen() {
  const recaptcha = useRef<FirebaseRecaptchaVerifierModal>(null);

  const [phone, setPhone] = useState("+57");
  const [code, setCode] = useState("");
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function sendCode() {
    const p = normalizePhone(phone);
    if (!isValidPhoneE164(p)) {
      Alert.alert("Número inválido", "Usa formato E.164. Ej: +573001234567");
      return;
    }

    try {
      setLoading(true);
      const result = await signInWithPhoneNumber(auth, p, recaptcha.current as any);
      setConfirmation(result);
      Alert.alert("Código enviado", "Revisa el SMS e ingresa el código.");
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }

  async function confirm() {
    if (!confirmation) return;

    const c = code.trim();
    if (c.length < 4) {
      Alert.alert("Código inválido", "Ingresa el código SMS.");
      return;
    }

    try {
      setLoading(true);
      await confirmation.confirm(c);
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 16, gap: 12 }}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptcha}
        firebaseConfig={firebaseConfig}
        attemptInvisibleVerification
      />

      <Text style={{ fontSize: 22, fontWeight: "700" }}>Keep Time It</Text>

      {!confirmation ? (
        <>
          <Text>Teléfono (E.164)</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="+573001234567"
            keyboardType="phone-pad"
            autoCapitalize="none"
            style={{ borderWidth: 1, padding: 10, borderRadius: 10 }}
          />
          <Button title={loading ? "Enviando..." : "Enviar código"} onPress={sendCode} disabled={loading} />
        </>
      ) : (
        <>
          <Text>Código SMS</Text>
          <TextInput
            value={code}
            onChangeText={setCode}
            placeholder="123456"
            keyboardType="number-pad"
            style={{ borderWidth: 1, padding: 10, borderRadius: 10 }}
          />
          <Button title={loading ? "Validando..." : "Confirmar"} onPress={confirm} disabled={loading} />
          <Button title="Cambiar número" onPress={() => { setConfirmation(null); setCode(""); }} />
        </>
      )}
    </View>
  );
}
