import { Text, View } from "react-native";

type MoreHeaderProps = {
  gymName?: string;
};

export function MoreHeader({ gymName }: MoreHeaderProps) {
  return (
    <View>
      <Text className="text-base text-secondary">Manage your gym</Text>

      <Text className="mt-1 text-3xl font-bold text-primary">More</Text>

      {gymName && (
        <Text className="mt-2 text-sm text-secondary">{gymName}</Text>
      )}
    </View>
  );
}
