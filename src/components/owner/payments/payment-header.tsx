import { Text, View } from "react-native";

type PaymentHeaderProps = {
  gymName: string;
};

export function PaymentHeader({ gymName }: PaymentHeaderProps) {
  return (
    <View>
      <Text className="text-3xl font-bold text-primary">Payments</Text>

      <Text className="mt-1 text-sm text-secondary">
        Payment history for {gymName}
      </Text>
    </View>
  );
}
