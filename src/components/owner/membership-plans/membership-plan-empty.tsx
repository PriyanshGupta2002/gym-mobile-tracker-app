import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

type MembershipPlanEmptyProps = {
  onCreate: () => void;
};

export function MembershipPlanEmpty({ onCreate }: MembershipPlanEmptyProps) {
  return (
    <View className="items-center rounded-2xl border border-border bg-surface px-6 py-10">
      <View className="h-14 w-14 items-center justify-center rounded-2xl bg-accent/10">
        <Ionicons name="card-outline" size={28} color="#A3E635" />
      </View>

      <Text className="mt-5 text-xl font-bold text-primary">
        No membership plans
      </Text>

      <Text className="mt-2 text-center text-sm leading-5 text-secondary">
        Create your first membership plan so you can assign it to members later.
      </Text>

      <View className="mt-6">
        <Pressable
          onPress={onCreate}
          className="rounded-xl bg-accent px-6 py-3"
        >
          <Text className="font-bold text-black">Add Plan</Text>
        </Pressable>
      </View>
    </View>
  );
}
