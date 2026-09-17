import { Card } from "@/components/ui/card";
import { Text, View } from "react-native";

type MembershipSummaryCardProps = {
  membership: {
    status: string;
    gym?: {
      name: string;
      city: string;
    } | null;
    plan?: {
      name: string;
    } | null;
    expires_at?: string | null;
  } | null;
};

export function MembershipSummaryCard({
  membership,
}: MembershipSummaryCardProps) {
  if (!membership) {
    return (
      <Card>
        <Text className="text-base font-bold text-primary">No membership</Text>

        <Text className="mt-1 text-sm text-secondary">
          You are not currently associated with a gym.
        </Text>
      </Card>
    );
  }

  const status = membership.status;

  return (
    <Card>
      <View className="flex-row items-center justify-between">
        <Text className="text-lg font-bold text-primary">Membership</Text>

        <View className="rounded-full bg-accent/15 px-3 py-1.5">
          <Text className="text-xs font-bold uppercase text-accent">
            {status}
          </Text>
        </View>
      </View>

      <View className="mt-5">
        <Text className="text-xs text-secondary">GYM</Text>

        <Text className="mt-1 text-base font-semibold text-primary">
          {membership.gym?.name || "—"}
        </Text>

        {membership.gym?.city && (
          <Text className="mt-1 text-sm text-secondary">
            {membership.gym.city}
          </Text>
        )}
      </View>

      {membership.plan && (
        <View className="mt-4">
          <Text className="text-xs text-secondary">MEMBERSHIP PLAN</Text>

          <Text className="mt-1 text-base font-semibold text-primary">
            {membership.plan.name}
          </Text>
        </View>
      )}

      {membership.expires_at && (
        <View className="mt-4">
          <Text className="text-xs text-secondary">EXPIRES</Text>

          <Text className="mt-1 text-base font-semibold text-primary">
            {new Date(membership.expires_at).toLocaleDateString()}
          </Text>
        </View>
      )}
    </Card>
  );
}
