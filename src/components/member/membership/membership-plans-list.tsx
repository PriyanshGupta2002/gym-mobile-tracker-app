import { Text, View } from "react-native";

import { Card } from "@/components/ui/card";

import { MembershipPlanCard } from "./membership-plan-card";

import type { MembershipPlan } from "@/services/membership-plan";

type MembershipPlansListProps = {
  plans: MembershipPlan[];
  onSelectPlan?: (plan: MembershipPlan) => void;
};

export function MembershipPlansList({
  plans,
  onSelectPlan,
}: MembershipPlansListProps) {
  return (
    <View className="mt-8">
      <Text className="text-xl font-bold text-primary">Available plans</Text>

      <Text className="mt-1 text-sm text-secondary">
        Choose a membership plan for your gym.
      </Text>

      {plans.length === 0 ? (
        <Card className="mt-5">
          <Text className="text-center text-base text-secondary">
            No membership plans are currently available.
          </Text>
        </Card>
      ) : (
        <View className="mt-5 gap-4">
          {plans?.map((plan) => (
            <MembershipPlanCard
              key={plan.id}
              plan={plan}
              onSelect={onSelectPlan}
            />
          ))}
        </View>
      )}
    </View>
  );
}
