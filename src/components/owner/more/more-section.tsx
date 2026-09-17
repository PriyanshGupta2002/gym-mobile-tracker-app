import { ReactNode } from "react";
import { Text, View } from "react-native";

type MoreSectionProps = {
  title: string;
  children: ReactNode;
};

export function MoreSection({ title, children }: MoreSectionProps) {
  return (
    <View className="mt-7">
      <Text className="mb-3 text-sm font-semibold text-secondary">{title}</Text>

      {children}
    </View>
  );
}
