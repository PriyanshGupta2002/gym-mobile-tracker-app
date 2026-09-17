import { Text, View } from "react-native";

export function PaymentEmptyState() {
  return (
    <View className="mt-4 rounded-2xl border border-border p-6">
      <Text className="text-center text-base font-semibold text-primary">
        No payments yet
      </Text>

      <Text className="mt-2 text-center text-sm leading-5 text-secondary">
        Membership payments made by your members will appear here.
      </Text>
    </View>
  );
}
