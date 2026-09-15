import "../../global.css";

import { Stack } from "expo-router";
import { useEffect } from "react";

import { useAuthStore } from "@/store/auth-store";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Toaster } from "sonner-native";
export default function RootLayout() {
  const restoreSession = useAuthStore((state) => state.restoreSession);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  return (
    <GestureHandlerRootView>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
      <Toaster />
    </GestureHandlerRootView>
  );
}
