import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

type MoreMenuItemProps = {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  danger?: boolean;
};

export function MoreMenuItem({
  title,
  description,
  icon,
  onPress,
  danger = false,
}: MoreMenuItemProps) {
  return (
    <Pressable
      onPress={onPress}
      className="mb-3 flex-row items-center rounded-2xl border border-border bg-surface p-4 active:opacity-70"
    >
      <View
        className={`h-11 w-11 items-center justify-center rounded-xl ${
          danger ? "bg-red-500/10" : "bg-accent/10"
        }`}
      >
        <Ionicons
          name={icon}
          size={22}
          color={danger ? "#F87171" : "#A3E635"}
        />
      </View>

      <View className="ml-4 flex-1">
        <Text
          className={`text-base font-bold ${
            danger ? "text-red-400" : "text-primary"
          }`}
        >
          {title}
        </Text>

        <Text className="mt-1 text-sm leading-5 text-secondary">
          {description}
        </Text>
      </View>

      <Ionicons name="chevron-forward" size={18} color="#71717A" />
    </Pressable>
  );
}
