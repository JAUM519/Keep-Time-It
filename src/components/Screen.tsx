import React from "react";
import { View, StyleSheet, ViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = ViewProps & {
  children: React.ReactNode;
};

export function Screen({ children, style, ...rest }: Props) {
  return (
    <SafeAreaView style={styles.safe} edges={["top", "right", "left"]}>
      <View style={[styles.container, style]} {...rest}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1, padding: 16, gap: 12 },
});
