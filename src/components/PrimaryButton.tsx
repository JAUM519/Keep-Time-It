import React from "react";
import { Pressable, StyleSheet, Text, ActivityIndicator, ViewStyle } from "react-native";

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
};

export function PrimaryButton({ title, onPress, disabled, loading, style }: Props) {
  const isDisabled = !!disabled || !!loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.btn,
        isDisabled && styles.btnDisabled,
        pressed && !isDisabled && styles.btnPressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111827",
  },
  btnDisabled: { opacity: 0.6 },
  btnPressed: { opacity: 0.85 },
  text: { color: "white", fontSize: 16, fontWeight: "600" },
});
