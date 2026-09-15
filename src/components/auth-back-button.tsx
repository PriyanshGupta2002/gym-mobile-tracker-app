import { router } from "expo-router";
import { Pressable, Text } from "react-native";

type AuthBackButtonProps = {
  label?: string;
};

export function AuthBackButton({ label = "Back" }: AuthBackButtonProps) {
  return (
    <Pressable
      onPress={() => router.back()}
      className="mt-8 self-center rounded-full bg-surface px-6 py-3"
      hitSlop={8}
    >
      <Text className="text-sm font-semibold text-primary">← {label}</Text>
    </Pressable>
  );
}
