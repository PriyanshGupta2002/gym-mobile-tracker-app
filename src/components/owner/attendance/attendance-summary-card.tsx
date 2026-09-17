import { Text, View } from "react-native";

type Props = {
  total: number;
};

export function AttendanceSummaryCard({ total }: Props) {
  return (
    <View className="mt-6 rounded-2xl border border-border bg-card p-5">
      <Text className="text-sm text-secondary">Check-ins</Text>

      <Text className="mt-2 text-4xl font-bold text-accent">{total}</Text>

      <Text className="mt-1 text-sm text-secondary">Members checked in</Text>
    </View>
  );
}
