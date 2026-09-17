import { Text, View } from "react-native";

import { Card } from "@/components/ui/card";

import type { Membership } from "@/services/auth";

type CurrentMembershipCardProps = {
  membership: Membership;
};

export function CurrentMembershipCard({
  membership,
}: CurrentMembershipCardProps) {
  const formatDate = (date: string | null | undefined) => {
    if (!date) {
      return "—";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Card className="mt-6">
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-xs font-semibold tracking-wider text-secondary">
            CURRENT MEMBERSHIP
          </Text>

          <Text className="mt-2 text-xl font-bold text-primary">
            {membership.plan?.name || "Active Membership"}
          </Text>
        </View>

        <View className="rounded-full bg-accent/15 px-3 py-1">
          <Text className="text-xs font-bold text-accent">
            {membership.status.toUpperCase()}
          </Text>
        </View>
      </View>

      {membership.plan && (
        <View className="mt-4">
          <Text className="text-sm text-secondary">
            {membership.plan.duration_days} days
          </Text>
        </View>
      )}

      <View className="mt-5 border-t border-border pt-4">
        <Text className="text-xs text-secondary">Member since</Text>

        <Text className="mt-1 text-sm font-semibold text-primary">
          {formatDate(membership.joined_at)}
        </Text>
      </View>

      {membership.expires_at && (
        <View className="mt-4">
          <Text className="text-xs text-secondary">Expires</Text>

          <Text className="mt-1 text-sm font-semibold text-primary">
            {formatDate(membership.expires_at)}
          </Text>
        </View>
      )}
    </Card>
  );
}
