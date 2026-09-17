import { Text, View } from "react-native";

import type { GymAttendanceItem } from "@/services/attendance";

type Props = {
  attendance: GymAttendanceItem;
};

export function AttendanceMemberRow({ attendance }: Props) {
  const name = attendance.member.name || "Member";

  const time = new Date(attendance.checked_in_at).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <View className="flex-row items-center border-b border-border py-4">
      <View className="h-11 w-11 items-center justify-center rounded-full bg-accent/15">
        <Text className="text-base font-bold text-accent">
          {name.charAt(0).toUpperCase()}
        </Text>
      </View>

      <View className="ml-3 flex-1">
        <Text className="text-base font-semibold text-primary">{name}</Text>

        <Text className="mt-1 text-sm text-secondary">
          {attendance.member.phone}
        </Text>
      </View>

      <Text className="text-sm font-semibold text-primary">{time}</Text>
    </View>
  );
}
