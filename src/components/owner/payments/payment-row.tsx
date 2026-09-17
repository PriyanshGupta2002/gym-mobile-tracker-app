import { Text, View } from "react-native";

import { Card } from "@/components/ui/card";

import type { OwnerPayment } from "@/services/payment";

type PaymentRowProps = {
  payment: OwnerPayment;
};

function formatAmount(amount: string) {
  const value = Number(amount);

  if (Number.isNaN(value)) {
    return "₹0";
  }

  return `₹${value.toLocaleString("en-IN")}`;
}

function formatDate(date: string) {
  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return "";
  }

  return value.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(date: string) {
  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return "";
  }

  return value.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function getStatusClasses(status: OwnerPayment["status"]) {
  switch (status) {
    case "PAID":
      return {
        container: "bg-green-500/10",
        text: "text-green-500",
      };

    case "FAILED":
      return {
        container: "bg-red-500/10",
        text: "text-red-400",
      };

    default:
      return {
        container: "bg-yellow-500/10",
        text: "text-yellow-500",
      };
  }
}

export function PaymentRow({ payment }: PaymentRowProps) {
  const statusStyles = getStatusClasses(payment.status);

  return (
    <Card className="mb-3">
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-3">
          <Text className="text-base font-bold text-primary">
            {payment.member.name || "Unknown member"}
          </Text>

          <Text className="mt-1 text-sm text-secondary">
            {payment.plan.name}
          </Text>

          <Text className="mt-2 text-xs text-secondary">
            {payment.paid_at
              ? `${formatDate(payment.paid_at)} • ${formatTime(payment.paid_at)}`
              : `${formatDate(payment.created_at)} • ${formatTime(
                  payment.created_at,
                )}`}
          </Text>
        </View>

        <View className="items-end">
          <Text className="text-lg font-bold text-primary">
            {formatAmount(payment.amount)}
          </Text>

          <View
            className={`mt-2 rounded-full px-3 py-1 ${statusStyles.container}`}
          >
            <Text className={`text-xs font-bold ${statusStyles.text}`}>
              {payment.status}
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
}
