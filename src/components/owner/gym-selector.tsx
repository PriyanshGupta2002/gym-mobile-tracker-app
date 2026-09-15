import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { OwnerGym } from "@/store/owner-store";

type GymSelectorProps = {
  gym: OwnerGym;
  onPress: () => void;
};

export function GymSelector({ gym, onPress }: GymSelectorProps) {
  return (
    <Pressable onPress={onPress} className="rounded-2xl bg-surface px-4 py-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-xs font-semibold tracking-wider text-secondary">
            CURRENT GYM
          </Text>

          <Text
            className="mt-1 text-lg font-bold text-primary"
            numberOfLines={1}
          >
            {gym.name}
          </Text>

          <View className="mt-1 flex-row items-center">
            <Ionicons name="location-outline" size={14} color="#71717A" />

            <Text className="ml-1 text-sm text-secondary">{gym.city}</Text>
          </View>
        </View>

        <View className="h-10 w-10 items-center justify-center rounded-full bg-surface-light">
          <Ionicons name="chevron-down" size={20} color="#A3E635" />
        </View>
      </View>
    </Pressable>
  );
}
