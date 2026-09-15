import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";

import { AuthBackButton } from "@/components/auth-back-button";
import { sendOtp } from "@/services/auth";

import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Screen } from "../../components/ui/screen";

export default function LoginScreen() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { role } = useLocalSearchParams<{
    role?: "member" | "owner";
  }>();

  const isOwner = role === "owner";

  const handleContinue = async () => {
    if (phone.length !== 10 || loading) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Send OTP through the real FastAPI backend
      await sendOtp(phone);

      // Only navigate if OTP was successfully sent
      router.push({
        pathname: "/(auth)/verify-otp",
        params: {
          phone,
          role: role ?? "member",
        },
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to send OTP. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <View className="flex-1 px-1">
        {/* Header */}
        <View className="mt-8">
          <View className="mb-4 self-start rounded-full bg-accent/15 px-4 py-2">
            <Text className="text-sm font-semibold text-accent">
              {isOwner ? "GYM OWNER" : "MEMBER"}
            </Text>
          </View>

          <Text className="text-4xl font-bold leading-tight text-primary">
            Welcome back
          </Text>

          <Text className="mt-3 text-base leading-6 text-secondary">
            {isOwner
              ? "Sign in to manage your gym, members and attendance."
              : "Sign in to manage your membership and track your attendance."}
          </Text>
        </View>

        {/* Login Card */}
        <View className="mt-10">
          <Card>
            <Text className="text-lg font-bold text-primary">
              Enter your phone number
            </Text>

            <Text className="mt-1 text-sm leading-5 text-secondary">
              We'll send you a one-time verification code.
            </Text>

            {/* Phone Number */}
            <View className="mt-6">
              <Text className="mb-2 text-sm font-semibold text-primary">
                Mobile number
              </Text>

              <View className="flex-row items-center">
                {/* Country Code */}
                <View className="mr-2 h-14 justify-center rounded-xl border border-border bg-surface px-4">
                  <Text className="text-base font-semibold text-primary">
                    +91
                  </Text>
                </View>

                {/* Phone Input */}
                <View className="flex-1">
                  <Input
                    placeholder="10-digit mobile number"
                    keyboardType="number-pad"
                    value={phone}
                    onChangeText={(value) => {
                      setPhone(value.replace(/[^0-9]/g, ""));

                      if (error) {
                        setError("");
                      }
                    }}
                    maxLength={10}
                  />
                </View>
              </View>

              {/* Error */}
              {error ? (
                <Text className="mt-3 text-sm font-medium text-red-500">
                  {error}
                </Text>
              ) : null}

              {/* Send OTP */}
              <View className="mt-6">
                <Button
                  onPress={handleContinue}
                  disabled={phone.length !== 10}
                  loading={loading}
                >
                  Send OTP
                </Button>
              </View>
            </View>
          </Card>
        </View>

        {/* Terms */}
        <View className="mt-6 px-4">
          <Text className="text-center text-xs leading-5 text-secondary">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </Text>
        </View>

        {/* Back */}
        <AuthBackButton />
      </View>
    </Screen>
  );
}
