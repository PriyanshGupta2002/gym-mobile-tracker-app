import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

type QrHeaderProps = {
  gymName: string;
  city: string;
};

export function QrHeader({ gymName, city }: QrHeaderProps) {
  return (
    <View>
      <View className="flex-row items-center">
        <View className="h-12 w-12 items-center justify-center rounded-xl bg-accent">
          <Ionicons name="qr-code-outline" size={25} color="#18181B" />
        </View>

        <View className="ml-3 flex-1">
          <Text className="text-2xl font-bold text-primary">QR Codes</Text>

          <Text className="mt-1 text-sm text-secondary">
            {gymName} · {city}
          </Text>
        </View>
      </View>

      <Text className="mt-4 text-sm leading-5 text-secondary">
        Generate a QR code for your members to join the gym or mark their daily
        attendance.
      </Text>
    </View>
  );
}
