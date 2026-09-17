import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

type MembershipPlanHeaderProps = {
  gymName: string;
};

export function MembershipPlanHeader({ gymName }: MembershipPlanHeaderProps) {
  return (
    <View>
      <View className="flex-row items-center">
        <Pressable
          onPress={() => router.back()}
          className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-surface"
        >
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
        </Pressable>

        <View className="flex-1">
          <Text className="text-2xl font-bold text-primary">
            Membership Plans
          </Text>

          <Text className="mt-1 text-sm text-secondary">{gymName}</Text>
        </View>
      </View>

      <Text className="mt-5 text-sm leading-5 text-secondary">
        Create the plans your gym offers to members. You can deactivate plans
        that are no longer available.
      </Text>
    </View>
  );
}
