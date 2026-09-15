import { Text, View } from "react-native";

import { Card } from "@/components/ui/card";
import { GymMember } from "@/services/gym";

type MemberCardProps = {
  membership: GymMember;
};

export function MemberCard({ membership }: MemberCardProps) {
  const member = membership.member;

  const name = member.name?.trim() || member.phone || "Unknown member";

  return (
    <Card className="mb-3">
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-base font-semibold text-primary">{name}</Text>

          <Text className="mt-1 text-sm text-secondary">{member.phone}</Text>
        </View>

        <View className="ml-3 rounded-full bg-accent/10 px-3 py-1">
          <Text className="text-xs font-semibold capitalize text-accent">
            {membership.status}
          </Text>
        </View>
      </View>

      <View className="mt-4">
        <Text className="text-xs text-secondary">Joined</Text>

        <Text className="mt-1 text-sm font-medium text-primary">
          {formatDate(membership.joined_at)}
        </Text>
      </View>
    </Card>
  );
}

function formatDate(date: string) {
  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
