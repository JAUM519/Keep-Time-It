import React, { useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebase";

export default function EmailSignInScreen() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);

  async function signIn() {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email.trim(), pass);
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }

  async function signUp() {
    try {
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email.trim(), pass);
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>Keep Time It</Text>

      <Text>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="correo@ejemplo.com"
        autoCapitalize="none"
        keyboardType="email-address"
        style={{ borderWidth: 1, padding: 10, borderRadius: 10 }}
      />

      <Text>Contraseña</Text>
      <TextInput
        value={pass}
        onChangeText={setPass}
        placeholder="mínimo 6 caracteres"
        secureTextEntry
        style={{ borderWidth: 1, padding: 10, borderRadius: 10 }}
      />

      <Button title={loading ? "Entrando..." : "Iniciar sesión"} onPress={signIn} disabled={loading} />
      <Button title={loading ? "Creando..." : "Crear cuenta"} onPress={signUp} disabled={loading} />
    </View>
  );
}
