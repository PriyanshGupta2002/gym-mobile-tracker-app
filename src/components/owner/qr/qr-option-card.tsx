import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

type QrOptionCardProps = {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  selected: boolean;
  onPress: () => void;
};

export function QrOptionCard({
  title,
  description,
  icon,
  selected,
  onPress,
}: QrOptionCardProps) {
  return (
    <Pressable onPress={onPress}>
      <View
        className={`rounded-2xl border p-4 ${
          selected ? "border-accent bg-accent/10" : "border-border bg-surface"
        }`}
      >
        <View className="flex-row items-center">
          <View
            className={`h-11 w-11 items-center justify-center rounded-xl ${
              selected ? "bg-accent" : "bg-surface-light"
            }`}
          >
            <Ionicons
              name={icon}
              size={22}
              color={selected ? "#18181B" : "#A1A1AA"}
            />
          </View>

          <View className="ml-3 flex-1">
            <Text className="text-base font-bold text-primary">{title}</Text>

            <Text className="mt-1 text-sm leading-5 text-secondary">
              {description}
            </Text>
          </View>

          <View
            className={`h-5 w-5 items-center justify-center rounded-full border-2 ${
              selected ? "border-accent bg-accent" : "border-secondary"
            }`}
          >
            {selected && <View className="h-2 w-2 rounded-full bg-black" />}
          </View>
        </View>
      </View>
    </Pressable>
  );
}
