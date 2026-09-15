import { Pressable, Text } from "react-native";

import { Card } from "@/components/ui/card";

type MembersErrorProps = {
  message: string;
  onRetry: () => void;
};

export function MembersError({ message, onRetry }: MembersErrorProps) {
  return (
    <Card className="mt-6">
      <Text className="text-base font-semibold text-primary">
        Couldn't load members
      </Text>

      <Text className="mt-2 text-sm leading-5 text-secondary">{message}</Text>

      <Pressable
        onPress={onRetry}
        className="mt-4 self-start rounded-full bg-accent px-4 py-2"
      >
        <Text className="font-semibold text-black">Try again</Text>
      </Pressable>
    </Card>
  );
}
