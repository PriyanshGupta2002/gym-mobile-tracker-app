import { router } from "expo-router";
import { Text, View } from "react-native";

import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Screen } from "../../components/ui/screen";

export default function JoinGymScreen() {
  const handleScanGym = () => {
    router.push("/(auth)/scan-gym");
  };

  const handleEnterCode = () => {
    router.push("/(auth)/enter-gym-code");
  };

  return (
    <Screen>
      <View className="flex-1 px-1">
        {/* Back */}
        <View className="mt-2">
          <Button variant="ghost" onPress={() => router.back()}>
            ← Back
          </Button>
        </View>

        {/* Header */}
        <View className="mt-8">
          <View className="mb-4 self-start rounded-full bg-accent/15 px-4 py-2">
            <Text className="text-sm font-semibold text-accent">MEMBER</Text>
          </View>

          <Text className="text-4xl font-bold leading-tight text-primary">
            Join your gym
          </Text>

          <Text className="mt-3 text-base leading-6 text-secondary">
            Connect your account to your gym to access your membership and
            attendance.
          </Text>
        </View>

        {/* Options */}
        <View className="mt-10 gap-4">
          {/* Scan QR */}
          <Card>
            <Text className="text-3xl">📷</Text>

            <Text className="mt-4 text-xl font-bold text-primary">
              Scan gym QR
            </Text>

            <Text className="mt-2 text-sm leading-5 text-secondary">
              Ask your gym owner to show you their gym joining QR code.
            </Text>

            <View className="mt-5">
              <Button onPress={handleScanGym}>Scan QR Code</Button>
            </View>
          </Card>

          {/* Enter code */}
          <Card>
            <Text className="text-3xl">🔢</Text>

            <Text className="mt-4 text-xl font-bold text-primary">
              Enter gym code
            </Text>

            <Text className="mt-2 text-sm leading-5 text-secondary">
              Have a gym code? You can enter it manually.
            </Text>

            <View className="mt-5">
              <Button variant="secondary" onPress={handleEnterCode}>
                Enter Code
              </Button>
            </View>
          </Card>
        </View>
      </View>
    </Screen>
  );
}
