import { Text, View } from "react-native";

type MembersHeaderProps = {
  gymName: string;
};

export function MembersHeader({ gymName }: MembersHeaderProps) {
  return (
    <View>
      <Text className="text-sm font-medium text-secondary">{gymName}</Text>

      <Text className="mt-1 text-3xl font-bold text-primary">Members</Text>

      <Text className="mt-2 text-sm leading-5 text-secondary">
        Manage members registered at this gym.
      </Text>
    </View>
  );
}
