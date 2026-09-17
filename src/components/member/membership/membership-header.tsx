import { Text, View } from "react-native";

type MembershipHeaderProps = {
  gymName: string;
};

export function MembershipHeader({ gymName }: MembershipHeaderProps) {
  return (
    <View>
      <Text className="text-3xl font-bold text-primary">Membership</Text>

      <Text className="mt-2 text-sm text-secondary">
        Manage your membership at {gymName}.
      </Text>
    </View>
  );
}
