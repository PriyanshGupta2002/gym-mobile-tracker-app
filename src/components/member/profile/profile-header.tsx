import { Text, View } from "react-native";

type ProfileHeaderProps = {
  name: string;
  phone?: string | null;
  role?: string | null;
};

export function ProfileHeader({ name, phone, role }: ProfileHeaderProps) {
  const initial = name?.charAt(0)?.toUpperCase() || "M";

  return (
    <View className="items-center pt-6">
      <View className="h-24 w-24 items-center justify-center rounded-full bg-accent/15">
        <Text className="text-4xl font-bold text-accent">{initial}</Text>
      </View>

      <Text className="mt-4 text-2xl font-bold text-primary">
        {name || "Member"}
      </Text>

      <Text className="mt-1 text-sm text-secondary">
        {phone || "No phone number"}
      </Text>

      <View className="mt-3 rounded-full bg-accent/15 px-4 py-2">
        <Text className="text-xs font-bold uppercase text-accent">
          {role || "member"}
        </Text>
      </View>
    </View>
  );
}
