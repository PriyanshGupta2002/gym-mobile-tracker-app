import { router } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";

import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Screen } from "../../components/ui/screen";
import { joinGym } from "../../services/membership";

export default function EnterGymCodeScreen() {
  const [gymCode, setGymCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleJoinGym = async () => {
    if (!gymCode.trim() || loading) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      await joinGym(gymCode.trim());

      router.replace("/(member)");
    } catch (error) {
      console.error("Failed to join gym:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to join gym. Please try again.",
      );
    } finally {
      setLoading(false);
    }
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
            Enter gym code
          </Text>

          <Text className="mt-3 text-base leading-6 text-secondary">
            Enter the gym code provided by your gym owner.
          </Text>
        </View>

        {/* Form */}
        <View className="mt-10">
          <Card>
            <Text className="text-lg font-bold text-primary">Gym code</Text>

            <Text className="mt-1 text-sm leading-5 text-secondary">
              You can find this code from your gym owner.
            </Text>

            <View className="mt-6">
              <Input
                placeholder="Enter gym code"
                value={gymCode}
                onChangeText={(value) => {
                  setGymCode(value);

                  if (error) {
                    setError("");
                  }
                }}
                autoCapitalize="characters"
                autoCorrect={false}
              />
            </View>

            {error ? (
              <Text className="mt-4 text-sm font-medium text-red-500">
                {error}
              </Text>
            ) : null}

            <View className="mt-6">
              <Button
                onPress={handleJoinGym}
                disabled={!gymCode.trim()}
                loading={loading}
              >
                Join Gym
              </Button>
            </View>
          </Card>
        </View>
      </View>
    </Screen>
  );
}
