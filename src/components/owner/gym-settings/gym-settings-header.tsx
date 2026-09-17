import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

export function GymSettingsHeader() {
  return (
    <View className="flex-row items-center">
      <Pressable
        onPress={() => router.back()}
        className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-card"
        hitSlop={8}
      >
        <Ionicons name="arrow-back" size={21} className="text-primary" />
      </Pressable>

      <View className="flex-1">
        <Text className="text-2xl font-bold text-primary">Gym Settings</Text>

        <Text className="mt-1 text-sm text-secondary">
          Manage your gym information
        </Text>
      </View>
    </View>
  );
}
