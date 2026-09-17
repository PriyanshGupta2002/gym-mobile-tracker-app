import { Card } from "@/components/ui/card";
import { Pressable, Text, View } from "react-native";

type ProfileActionCardProps = {
  onNotifications?: () => void;
  onHelp?: () => void;
};

export function ProfileActionCard({
  onNotifications,
  onHelp,
}: ProfileActionCardProps) {
  return (
    <Card className="p-0">
      <Pressable
        onPress={onNotifications}
        className="flex-row items-center justify-between px-4 py-5"
      >
        <View className="flex-1">
          <Text className="text-base font-semibold text-primary">
            Notifications
          </Text>

          <Text className="mt-1 text-sm text-secondary">
            Manage notification preferences
          </Text>
        </View>

        <Text className="text-2xl text-secondary">›</Text>
      </Pressable>

      <View className="border-t border-border" />

      <Pressable
        onPress={onHelp}
        className="flex-row items-center justify-between px-4 py-5"
      >
        <View className="flex-1">
          <Text className="text-base font-semibold text-primary">
            Help & Support
          </Text>

          <Text className="mt-1 text-sm text-secondary">
            Get help with your account
          </Text>
        </View>

        <Text className="text-2xl text-secondary">›</Text>
      </Pressable>
    </Card>
  );
}
