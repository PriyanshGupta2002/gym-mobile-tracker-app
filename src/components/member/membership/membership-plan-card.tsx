import { Pressable, Text, View } from "react-native";

import { Card } from "@/components/ui/card";

import type { MembershipPlan } from "@/services/membership-plan";
import { useState } from "react";

type MembershipPlanCardProps = {
  plan: MembershipPlan;
  onSelect?: (plan: MembershipPlan) => void;
};

export function MembershipPlanCard({
  plan,
  onSelect,
}: MembershipPlanCardProps) {
  const price = Number(plan.price);
  const [processingPayment, setProcessingPayment] = useState(false);

  return (
    <Pressable
      onPress={() => onSelect?.(plan)}
      disabled={!onSelect}
      className="active:opacity-80"
    >
      <Card>
        <View className="flex-row items-start justify-between">
          <View className="flex-1 pr-4">
            <Text className="text-xl font-bold text-primary">{plan.name}</Text>

            <Text className="mt-2 text-sm text-secondary">
              {plan.duration_days} days
            </Text>
          </View>

          <View className="items-end">
            <Text className="text-2xl font-bold text-primary">
              ₹{price.toLocaleString("en-IN")}
            </Text>

            <Text className="mt-1 text-xs text-secondary">total</Text>
          </View>
        </View>

        <View className="mt-5 border-t border-border pt-4">
          <Text className="text-sm font-semibold text-accent">Continue →</Text>
        </View>
      </Card>
    </Pressable>
  );
}
