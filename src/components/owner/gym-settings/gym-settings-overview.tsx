import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { Card } from "@/components/ui/card";

type GymSettingsOverviewProps = {
  name: string;
  city: string;
};

export function GymSettingsOverview({ name, city }: GymSettingsOverviewProps) {
  return (
    <Card className="mt-7">
      <View className="flex-row items-center">
        <View className="h-14 w-14 items-center justify-center rounded-2xl bg-accent/15">
          <Ionicons name="business" size={26} className="text-accent" />
        </View>

        <View className="ml-4 flex-1">
          <Text className="text-lg font-bold text-primary">{name}</Text>

          <Text className="mt-1 text-sm text-secondary">{city}</Text>
        </View>
      </View>
    </Card>
  );
}
