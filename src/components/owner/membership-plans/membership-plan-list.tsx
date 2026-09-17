import { Text, View } from "react-native";

import type { MembershipPlan } from "@/services/membership-plan";

import { MembershipPlanCard } from "./membership-plan-card";

type MembershipPlanListProps = {
  plans: MembershipPlan[];
  onPlanPress: (plan: MembershipPlan) => void;
};

export function MembershipPlanList({
  plans,
  onPlanPress,
}: MembershipPlanListProps) {
  return (
    <View className="mt-7">
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="text-sm font-semibold text-secondary">
          ACTIVE PLANS
        </Text>

        <Text className="text-xs text-secondary">
          {plans.length} {plans.length === 1 ? "plan" : "plans"}
        </Text>
      </View>

      {plans.map((plan) => (
        <MembershipPlanCard
          key={plan.id}
          plan={plan}
          onPress={() => onPlanPress(plan)}
        />
      ))}
    </View>
  );
}
