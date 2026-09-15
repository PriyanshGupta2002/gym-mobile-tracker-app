import { Text } from "react-native";

import { Card } from "@/components/ui/card";

type MembersSummaryCardProps = {
  total: number;
};

export function MembersSummaryCard({ total }: MembersSummaryCardProps) {
  return (
    <Card className="mt-6">
      <Text className="text-sm text-secondary">Total members</Text>

      <Text className="mt-1 text-4xl font-bold text-accent">{total}</Text>
    </Card>
  );
}
