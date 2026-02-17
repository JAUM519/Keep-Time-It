import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { listenAuthState } from "../services/auth";
import { RootStackParamList } from "./types";
import  EmailSignInScreen from "../screens/auth/EmailSignInScreen";
import { AppDrawerNavigator } from "./app/AppDrawerNavigator";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const [ready, setReady] = React.useState(false);
  const [signedIn, setSignedIn] = React.useState(false);

  React.useEffect(() => {
    const unsub = listenAuthState((user) => {
      setSignedIn(!!user);
      setReady(true);
    });
    return unsub;
  }, []);

  if (!ready) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!signedIn ? (
          <Stack.Screen name="Auth" component={EmailSignInScreen as any} />
        ) : (
          <Stack.Screen name="App" component={AppDrawerNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
