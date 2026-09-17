import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import type { MembershipPlan } from "@/services/membership-plan";

type MembershipPlanCardProps = {
  plan: MembershipPlan;
  onPress: () => void;
};

export function MembershipPlanCard({ plan, onPress }: MembershipPlanCardProps) {
  const formattedPrice = Number(plan.price).toLocaleString("en-IN");

  return (
    <Pressable
      onPress={onPress}
      className="mb-3 rounded-2xl border border-border bg-surface p-5 active:opacity-70"
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-1">
          <Text className="text-lg font-bold text-primary">{plan.name}</Text>

          <Text className="mt-1 text-sm text-secondary">
            {plan.duration_days} {plan.duration_days === 1 ? "day" : "days"}
          </Text>
        </View>

        <View className="rounded-full bg-accent/10 px-3 py-1">
          <Text className="text-xs font-semibold text-accent">Active</Text>
        </View>
      </View>

      <View className="mt-5 flex-row items-end justify-between">
        <View>
          <Text className="text-xs text-secondary">PRICE</Text>

          <Text className="mt-1 text-2xl font-bold text-primary">
            ₹{formattedPrice}
          </Text>
        </View>

        <View className="h-9 w-9 items-center justify-center rounded-full bg-background">
          <Ionicons name="chevron-forward" size={18} color="#71717A" />
        </View>
      </View>
    </Pressable>
  );
}
