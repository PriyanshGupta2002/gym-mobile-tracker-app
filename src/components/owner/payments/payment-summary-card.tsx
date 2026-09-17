import { Text, View } from "react-native";

import { Card } from "@/components/ui/card";

type PaymentSummaryCardProps = {
  totalCollected: string;
  todayCollected: string;
  totalPayments: number;
};

function formatAmount(amount: string) {
  const value = Number(amount);

  if (Number.isNaN(value)) {
    return "₹0";
  }

  return `₹${value.toLocaleString("en-IN")}`;
}

export function PaymentSummaryCard({
  totalCollected,
  todayCollected,
  totalPayments,
}: PaymentSummaryCardProps) {
  return (
    <Card className="mt-5">
      <Text className="text-sm font-medium text-secondary">
        Total collected
      </Text>

      <Text className="mt-1 text-4xl font-bold text-accent">
        {formatAmount(totalCollected)}
      </Text>

      <View className="mt-6 flex-row">
        <View className="flex-1">
          <Text className="text-xs text-secondary">TODAY</Text>

          <Text className="mt-1 text-lg font-bold text-primary">
            {formatAmount(todayCollected)}
          </Text>
        </View>

        <View className="flex-1">
          <Text className="text-xs text-secondary">PAYMENTS</Text>

          <Text className="mt-1 text-lg font-bold text-primary">
            {totalPayments}
          </Text>
        </View>
      </View>
    </Card>
  );
}
