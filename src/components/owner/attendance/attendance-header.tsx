import { Text, View } from "react-native";

type Props = {
  gymName?: string;
};

export function AttendanceHeader({ gymName }: Props) {
  return (
    <View>
      <Text className="text-3xl font-bold text-primary">Attendance</Text>

      <Text className="mt-1 text-sm text-secondary">
        Track member check-ins
      </Text>

      {gymName && (
        <Text className="mt-3 text-sm font-semibold text-accent">
          {gymName}
        </Text>
      )}
    </View>
  );
}
