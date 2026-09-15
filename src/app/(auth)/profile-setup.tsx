import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";

import { updateProfile } from "@/services/auth";

import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Screen } from "../../components/ui/screen";

export default function ProfileSetupScreen() {
  const { role } = useLocalSearchParams<{
    role?: "member" | "owner";
  }>();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isOwner = role === "owner";

  const handleContinue = async () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Please enter your name.");
      return;
    }

    if (trimmedName.length < 2) {
      setError("Name must be at least 2 characters.");
      return;
    }

    if (loading) {
      return;
    }

    try {
      setError("");
      setLoading(true);

      await updateProfile(trimmedName);

      if (isOwner) {
        router.replace("/(auth)/gym-setup");
      } else {
        router.replace("/(auth)/join-gym");
      }
    } catch (error) {
      console.error("Failed to update profile:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to update your profile. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <View className="flex-1 px-1">
        {/* Header */}
        <View className="mt-10">
          <View className="mb-4 self-start rounded-full bg-accent/15 px-4 py-2">
            <Text className="text-sm font-semibold text-accent">
              {isOwner ? "GYM OWNER" : "MEMBER"}
            </Text>
          </View>

          <Text className="text-4xl font-bold leading-tight text-primary">
            Let's get you set up
          </Text>

          <Text className="mt-3 text-base leading-6 text-secondary">
            {isOwner
              ? "Tell us your name to get your gym owner account ready."
              : "Tell us your name to personalize your GymApp experience."}
          </Text>
        </View>

        {/* Form */}
        <View className="mt-10">
          <Card>
            <Text className="text-lg font-bold text-primary">Your name</Text>

            <Text className="mt-1 text-sm leading-5 text-secondary">
              This is how you'll appear in the app.
            </Text>

            <View className="mt-6">
              <Input
                placeholder="Enter your full name"
                value={name}
                onChangeText={(value) => {
                  setName(value);
                  setError("");
                }}
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="done"
                editable={!loading}
              />
            </View>

            {/* Error */}
            {error ? (
              <View className="mt-3 rounded-xl bg-red-500/10 px-4 py-3">
                <Text className="text-sm leading-5 text-red-500">{error}</Text>
              </View>
            ) : null}

            {/* Continue */}
            <View className="mt-6">
              <Button
                onPress={handleContinue}
                loading={loading}
                disabled={!name.trim() || loading}
              >
                Continue
              </Button>
            </View>
          </Card>
        </View>
      </View>
    </Screen>
  );
}
