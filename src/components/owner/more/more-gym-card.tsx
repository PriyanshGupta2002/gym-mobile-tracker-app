import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

type MoreGymCardProps = {
  gymName: string;
  city: string;
};

export function MoreGymCard({ gymName, city }: MoreGymCardProps) {
  return (
    <View className="mt-6 flex-row items-center rounded-2xl border border-border bg-surface p-4">
      <View className="h-11 w-11 items-center justify-center rounded-xl bg-accent/10">
        <Ionicons name="business-outline" size={22} color="#A3E635" />
      </View>

      <View className="ml-4 flex-1">
        <Text className="text-base font-bold text-primary">{gymName}</Text>

        <Text className="mt-1 text-sm text-secondary">{city}</Text>
      </View>

      <View className="rounded-full bg-accent/10 px-3 py-1">
        <Text className="text-xs font-semibold text-accent">Active</Text>
      </View>
    </View>
  );
}
