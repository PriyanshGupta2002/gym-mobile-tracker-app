import { Card } from "@/components/ui/card";
import { Text, View } from "react-native";

type ProfileInfoCardProps = {
  name: string;
  phone?: string | null;
};

export function ProfileInfoCard({ name, phone }: ProfileInfoCardProps) {
  return (
    <Card className="p-0">
      <View className="px-4 py-5">
        <Text className="text-xs font-medium text-secondary">FULL NAME</Text>

        <Text className="mt-1 text-base font-semibold text-primary">
          {name || "Not set"}
        </Text>
      </View>

      <View className="border-t border-border" />

      <View className="px-4 py-5">
        <Text className="text-xs font-medium text-secondary">PHONE NUMBER</Text>

        <Text className="mt-1 text-base font-semibold text-primary">
          {phone || "Not available"}
        </Text>
      </View>
    </Card>
  );
}
