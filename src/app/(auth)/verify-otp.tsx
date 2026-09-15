import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import { AuthBackButton } from "@/components/auth-back-button";
import { getCurrentUser, sendOtp, verifyOtp } from "@/services/auth";
import { useAuthStore } from "@/store/auth-store";

import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Screen } from "../../components/ui/screen";

export default function VerifyOtpScreen() {
  const { phone, role } = useLocalSearchParams<{
    phone?: string;
    role?: "member" | "owner";
  }>();

  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(30);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");

  const inputRef = useRef<TextInput>(null);

  const { login } = useAuthStore();

  const isOwner = role === "owner";

  /*
   * Countdown
   */
  useEffect(() => {
    if (countdown === 0) {
      return;
    }

    const timer = setInterval(() => {
      setCountdown((current) => current - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  /*
   * Verify OTP
   */
  const handleVerify = async () => {
    if (otp.length !== 6 || !phone || !role || loading || resending) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await verifyOtp(phone, otp, role);

      console.log("OTP verified successfully:", response);

      /*
       * Save the authenticated user and access token.
       *
       * Name is intentionally null because
       * we collect it on Profile Setup.
       */
      await login(
        {
          id: response.user.id,
          name: null,
          phone: response.user.phone,
          role: response.user.role,
        },
        response.access_token,
        response.refresh_token,
      );

      /*
       * New user:
       *
       * User has been created by the backend,
       * but their profile is not completed yet.
       */
      if (response.is_new_user) {
        router.replace({
          pathname: "/(auth)/profile-setup",
          params: {
            role,
          },
        });

        return;
      }

      const me = await getCurrentUser();
      if (me.role === "member") {
        if (!me.membership || me.membership.status === "expired") {
          return router.replace("/(auth)/join-gym");
        }
        return router.replace("/(member)");
      }

      if (me.gym === null || me.gym.length === 0 || !me.gym) {
        router.replace("/(auth)/gym-setup");
        return;
      }

      router.replace("/(owner)");
      return;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to verify OTP. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  /*
   * Resend OTP
   */
  const handleResend = async () => {
    if (countdown > 0 || !phone || resending || loading) {
      return;
    }

    try {
      setResending(true);
      setError("");

      await sendOtp(phone);

      setOtp("");
      setCountdown(30);

      inputRef.current?.focus();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to resend OTP. Please try again.";

      setError(message);
    } finally {
      setResending(false);
    }
  };

  const formattedPhone = phone ? `+91 ${phone}` : "+91";

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
            Verify your number
          </Text>

          <Text className="mt-3 text-base leading-6 text-secondary">
            Enter the 6-digit code we sent to your mobile number.
          </Text>

          <Text className="mt-2 text-base font-semibold text-primary">
            {formattedPhone}
          </Text>
        </View>

        {/* OTP Card */}
        <View className="mt-10">
          <Card>
            <Text className="text-lg font-bold text-primary">
              Verification code
            </Text>

            <Text className="mt-1 text-sm text-secondary">
              Enter the code below to continue.
            </Text>

            {/* OTP Input */}
            <Pressable
              onPress={() => inputRef.current?.focus()}
              className="mt-7"
            >
              <View className="flex-row justify-between">
                {Array.from({ length: 6 }).map((_, index) => {
                  const digit = otp[index];

                  const isActive =
                    index === otp.length || (index === 5 && otp.length === 6);

                  return (
                    <View
                      key={index}
                      className={`h-14 w-[14%] items-center justify-center rounded-xl border ${
                        isActive ? "border-accent" : "border-border"
                      } bg-surface`}
                    >
                      <Text className="text-xl font-bold text-primary">
                        {digit || ""}
                      </Text>
                    </View>
                  );
                })}
              </View>

              <TextInput
                ref={inputRef}
                value={otp}
                onChangeText={(value) => {
                  setOtp(value.replace(/[^0-9]/g, "").slice(0, 6));

                  if (error) {
                    setError("");
                  }
                }}
                keyboardType="number-pad"
                maxLength={6}
                autoFocus
                className="absolute h-0 w-0 opacity-0"
              />
            </Pressable>

            {/* Error */}
            {error ? (
              <Text className="mt-4 text-center text-sm font-medium text-red-500">
                {error}
              </Text>
            ) : null}

            {/* Resend */}
            <View className="mt-6 items-center">
              {countdown > 0 ? (
                <Text className="text-sm text-secondary">
                  Resend code in{" "}
                  <Text className="font-semibold text-primary">
                    {countdown}s
                  </Text>
                </Text>
              ) : (
                <Pressable
                  onPress={handleResend}
                  disabled={resending || loading}
                >
                  <Text
                    className={`text-sm font-semibold ${
                      resending || loading ? "text-secondary" : "text-accent"
                    }`}
                  >
                    {resending ? "Sending..." : "Resend OTP"}
                  </Text>
                </Pressable>
              )}
            </View>

            {/* Verify */}
            <View className="mt-6">
              <Button
                onPress={handleVerify}
                disabled={otp.length !== 6 || !phone || !role || resending}
                loading={loading}
              >
                Verify & Continue
              </Button>
            </View>

            {/* Back */}
            <AuthBackButton />
          </Card>
        </View>

        {/* Help */}
        <View className="mt-6 px-4">
          <Text className="text-center text-xs leading-5 text-secondary">
            Didn't receive the code? Check your number and try again.
          </Text>
        </View>
      </View>
    </Screen>
  );
}
