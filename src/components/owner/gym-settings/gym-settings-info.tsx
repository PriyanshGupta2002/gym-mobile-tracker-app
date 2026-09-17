import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export function GymSettingsInfo() {
  return (
    <View className="mt-6 flex-row rounded-xl bg-accent/10 p-4">
      <Ionicons
        name="information-circle-outline"
        size={20}
        className="text-accent"
      />

      <Text className="ml-3 flex-1 text-sm leading-5 text-secondary">
        Changes to your gym information will be reflected throughout the app.
      </Text>
    </View>
  );
}
