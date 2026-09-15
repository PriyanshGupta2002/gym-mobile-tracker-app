import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { Screen } from "@/components/ui/screen";
import { checkIn, CheckInResponse } from "@/services/attendance";

type CheckInState = "scanning" | "confirm" | "success";

export default function CheckInScreen() {
  const [permission, requestPermission] = useCameraPermissions();

  const [state, setState] = useState<CheckInState>("scanning");
  const [isCheckingIn, setIsCheckingIn] = useState(false);

  const [checkInError, setCheckInError] = useState<string | null>(null);

  const [scannedData, setScannedData] = useState("");
  const [gymId, setGymId] = useState<string | null>(null);

  const [checkInResponse, setCheckInResponse] =
    useState<CheckInResponse | null>(null);

  /*
   * Reset scanner state
   */
  const resetScanner = () => {
    setState("scanning");
    setScannedData("");
    setGymId(null);
    setCheckInError(null);
    setCheckInResponse(null);
  };

  /*
   * Extract gym ID from QR
   *
   * Supported:
   *
   * 1. Plain UUID
   * d11f7a07-f17a-4106-8edb-cb250fe89eca
   *
   * 2. Gym deep link
   * gymapp://join?gym_id=d11f7a07-f17a-4106-8edb-cb250fe89eca
   */
  const extractGymId = (data: string): string | null => {
    try {
      const trimmedData = data.trim();

      if (!trimmedData.startsWith("gymapp://")) {
        return null;
      }

      const url = new URL(trimmedData);

      // For:
      // gymapp://attendance?gym_id=123
      //
      // URL parsing gives:
      // url.host = "attendance"
      // url.searchParams.get("gym_id") = "123"

      if (url.host !== "attendance") {
        return null;
      }

      const gymId = url.searchParams.get("gym_id");

      if (!gymId) {
        return null;
      }

      return gymId;
    } catch (error) {
      console.error("Failed to parse attendance QR:", error);
      return null;
    }
  };

  /*
   * Call check-in API
   */
  const handleCheckIn = async () => {
    if (!gymId) {
      setCheckInError("Invalid attendance QR code.");
      return;
    }

    try {
      setIsCheckingIn(true);
      setCheckInError(null);

      const response = await checkIn(gymId);

      if (!response.success) {
        setCheckInError(
          response.message || "Unable to check in. Please try again.",
        );
        return;
      }

      setCheckInResponse(response);
      setState("success");
    } catch (error: any) {
      console.error("Check-in failed:", error);

      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        "Unable to check in. Please try again.";

      setCheckInError(message);
    } finally {
      setIsCheckingIn(false);
    }
  };

  /*
   * Camera permission
   */
  if (!permission) {
    return null;
  }

  if (!permission.granted) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-3xl font-bold text-primary">Camera access</Text>

          <Text className="mt-3 text-center text-base text-secondary">
            We need access to your camera to scan your gym's QR code.
          </Text>

          <Pressable
            onPress={requestPermission}
            className="mt-8 rounded-xl bg-accent px-8 py-4"
          >
            <Text className="font-bold text-black">Allow Camera</Text>
          </Pressable>

          <Pressable onPress={() => router.back()} className="mt-4 px-6 py-3">
            <Text className="font-semibold text-secondary">Cancel</Text>
          </Pressable>
        </View>
      </Screen>
    );
  }

  /*
   * SUCCESS
   */
  if (state === "success") {
    const gym = checkInResponse?.attendance?.gym;

    const checkedInAt = checkInResponse?.attendance?.checkedInAt;

    return (
      <Screen>
        <View className="flex-1 items-center justify-center px-6">
          {/* Success icon */}
          <View className="h-20 w-20 items-center justify-center rounded-full bg-accent/15">
            <Text className="text-4xl text-accent">✓</Text>
          </View>

          <Text className="mt-6 text-3xl font-bold text-primary">
            You're checked in!
          </Text>

          <Text className="mt-3 text-center text-base text-secondary">
            Your attendance has been recorded successfully.
          </Text>

          {/* Gym information */}
          <View className="mt-8 w-full rounded-2xl border border-border bg-surface p-5">
            <Text className="text-xs font-semibold tracking-wider text-secondary">
              GYM
            </Text>

            <Text className="mt-2 text-xl font-bold text-primary">
              {gym?.name || "Gym"}
            </Text>

            {gym?.city && (
              <Text className="mt-1 text-sm text-secondary">{gym.city}</Text>
            )}

            <View className="mt-5 border-t border-border pt-4">
              <Text className="text-xs text-secondary">CHECKED IN</Text>

              <Text className="mt-1 text-sm font-semibold text-primary">
                {checkedInAt
                  ? new Date(checkedInAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Just now"}
              </Text>
            </View>
          </View>

          {/* Done */}
          <Pressable
            onPress={() => router.back()}
            className="mt-8 w-full items-center rounded-xl bg-accent py-4"
          >
            <Text className="font-bold text-black">Done</Text>
          </Pressable>
        </View>
      </Screen>
    );
  }

  /*
   * CONFIRM
   */
  if (state === "confirm") {
    return (
      <Screen>
        <View className="flex-1 px-5">
          {/* Header */}
          <View className="pt-5">
            <Pressable
              onPress={resetScanner}
              disabled={isCheckingIn}
              className="h-10 w-10 items-center justify-center rounded-full bg-surface"
            >
              <Text className="text-xl text-primary">‹</Text>
            </Pressable>
          </View>

          <View className="flex-1 items-center justify-center">
            {/* Icon */}
            <View className="h-20 w-20 items-center justify-center rounded-full bg-accent/15">
              <Text className="text-4xl text-accent">✓</Text>
            </View>

            <Text className="mt-6 text-3xl font-bold text-primary">
              QR Code Scanned
            </Text>

            <Text className="mt-3 text-center text-base text-secondary">
              You're about to check in at this gym.
            </Text>

            {/* Gym ID */}
            <View className="mt-8 w-full rounded-2xl border border-border bg-surface p-5">
              <Text className="text-xs font-semibold tracking-wider text-secondary">
                GYM ID
              </Text>

              <Text
                className="mt-2 text-base font-semibold text-primary"
                numberOfLines={2}
              >
                {gymId}
              </Text>
            </View>

            {/* Error */}
            {checkInError && (
              <Text className="mt-4 text-center text-sm text-red-400">
                {checkInError}
              </Text>
            )}

            {/* Check in */}
            <Pressable
              disabled={isCheckingIn}
              onPress={handleCheckIn}
              className={`mt-8 w-full items-center rounded-xl bg-accent py-4 ${
                isCheckingIn ? "opacity-60" : ""
              }`}
            >
              <Text className="text-base font-bold text-black">
                {isCheckingIn ? "Checking in..." : "Check In"}
              </Text>
            </Pressable>

            {/* Scan again */}
            {!isCheckingIn && (
              <Pressable onPress={resetScanner} className="mt-4 py-3">
                <Text className="font-semibold text-secondary">Scan Again</Text>
              </Pressable>
            )}
          </View>
        </View>
      </Screen>
    );
  }

  /*
   * SCANNING
   */
  return (
    <View className="flex-1 bg-black">
      <CameraView
        style={{ flex: 1 }}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={({ data }) => {
          if (state !== "scanning") {
            return;
          }

          console.log("Gym QR scanned:", data);

          const extractedGymId = extractGymId(data);

          if (!extractedGymId) {
            setCheckInError(
              "Invalid attendance QR code. Please scan a valid attendance QR.",
            );
            return;
          }

          setScannedData(data);
          setGymId(extractedGymId);
          setCheckInError(null);
          setState("confirm");
        }}
      />

      {/* Overlay */}
      <View className="absolute inset-0">
        {/* Header */}
        <View className="px-5 pt-14">
          <View className="flex-row items-center justify-between">
            <Pressable
              onPress={() => router.back()}
              className="h-10 w-10 items-center justify-center rounded-full bg-black/50"
            >
              <Text className="text-xl text-white">×</Text>
            </Pressable>

            <Text className="text-lg font-bold text-white">Check In</Text>

            <View className="h-10 w-10" />
          </View>
        </View>

        {/* Scanner frame */}
        <View className="flex-1 items-center justify-center">
          <View className="h-64 w-64 rounded-3xl border-2 border-accent" />

          <Text className="mt-8 text-base font-semibold text-white">
            Scan the attendance QR
          </Text>

          <Text className="mt-2 px-10 text-center text-sm text-white/60">
            Scan the attendance QR displayed at your gym to check in
          </Text>

          {checkInError != null && (
            <View className="absolute bottom-20 left-5 right-5 rounded-2xl border border-red-500/30 bg-black/90 px-5 py-4">
              <Text className="text-center text-sm font-bold text-red-400">
                Invalid QR code
              </Text>

              <Text className="mt-1 text-center text-xs leading-5 text-white/70">
                {checkInError}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
