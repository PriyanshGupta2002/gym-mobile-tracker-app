import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { Screen } from "@/components/ui/screen";
import { joinGym } from "@/services/membership";

type ScanGymState = "scanning" | "confirm";

export default function ScanGymScreen() {
  const [permission, requestPermission] = useCameraPermissions();

  const [state, setState] = useState<ScanGymState>("scanning");
  const [scannedData, setScannedData] = useState("");
  const [gymId, setGymId] = useState<string | null>(null);

  const [isJoining, setIsJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  if (!permission) {
    return null;
  }

  const resetScanner = () => {
    setState("scanning");
    setScannedData("");
    setGymId(null);
    setJoinError(null);
    setIsJoining(false);
  };

  const handleJoinGym = async () => {
    if (!gymId || isJoining) {
      return;
    }

    try {
      setIsJoining(true);
      setJoinError(null);

      const response = await joinGym(gymId);

      console.log("Gym joined successfully:", response);

      // User is now a member of the gym.
      router.replace("/(member)");
    } catch (error) {
      console.error("Error while joining the gym:", error);

      setJoinError(
        error instanceof Error
          ? error.message
          : "Unable to join the gym. Please try again.",
      );
    } finally {
      setIsJoining(false);
    }
  };

  // -------------------------
  // CAMERA PERMISSION
  // -------------------------

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

  // -------------------------
  // CONFIRM
  // -------------------------

  if (state === "confirm") {
    return (
      <Screen>
        <View className="flex-1 px-5">
          {/* Header */}
          <View className="pt-5">
            <Pressable
              disabled={isJoining}
              onPress={resetScanner}
              className="h-10 w-10 items-center justify-center rounded-full bg-surface"
            >
              <Text className="text-xl text-primary">‹</Text>
            </Pressable>
          </View>

          <View className="flex-1 items-center justify-center">
            <View className="h-20 w-20 items-center justify-center rounded-full bg-accent/15">
              <Text className="text-4xl text-accent">✓</Text>
            </View>

            <Text className="mt-6 text-3xl font-bold text-primary">
              Gym QR Scanned
            </Text>

            <Text className="mt-3 text-center text-base text-secondary">
              Gym code detected successfully.
            </Text>

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

            {/* Join button */}
            <Pressable
              disabled={isJoining || !gymId}
              onPress={handleJoinGym}
              className={`mt-8 w-full items-center rounded-xl bg-accent py-4 ${
                isJoining ? "opacity-60" : ""
              }`}
            >
              <Text className="text-base font-bold text-black">
                {isJoining ? "Joining gym..." : "Join Gym"}
              </Text>
            </Pressable>

            {/* Error */}
            {joinError && (
              <Text className="mt-3 text-center text-sm text-red-400">
                {joinError}
              </Text>
            )}

            {/* Scan again */}
            {!isJoining && (
              <Pressable onPress={resetScanner} className="mt-4 py-3">
                <Text className="font-semibold text-secondary">Scan Again</Text>
              </Pressable>
            )}
          </View>
        </View>
      </Screen>
    );
  }

  // -------------------------
  // SCANNING
  // -------------------------

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

          console.log("QR scanned:", data);

          let extractedGymId: string | null = null;

          try {
            if (data.startsWith("gymapp://")) {
              const url = new URL(data);

              const qrType = url.host;
              const gymId = url.searchParams.get("gym_id");

              console.log("QR type:", qrType);
              console.log("Gym ID:", gymId);

              // Only JOIN QR codes are valid here
              if (qrType !== "join") {
                setJoinError(
                  "Invalid QR code. Please scan the QR code provided by your gym to join.",
                );
                return;
              }

              if (!gymId) {
                setJoinError(
                  "Invalid QR code. Please scan the QR code provided by your gym to join.",
                );
                return;
              }

              extractedGymId = gymId;
            } else {
              // If you still want to support plain UUID QR codes
              extractedGymId = data.trim();
            }
          } catch (error) {
            console.error("Invalid QR data:", error);

            setJoinError(
              "Invalid QR code. Please scan the QR code provided by your gym to join.",
            );
            return;
          }

          if (!extractedGymId) {
            setJoinError(
              "Invalid QR code. Please scan the QR code provided by your gym to join.",
            );
            return;
          }

          setScannedData(data);
          setGymId(extractedGymId);
          setJoinError(null);
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

            <Text className="text-lg font-bold text-white">Join Gym</Text>

            <View className="h-10 w-10" />
          </View>
        </View>

        {/* Scanner */}
        <View className="flex-1 items-center justify-center">
          <View className="h-64 w-64 rounded-3xl border-2 border-accent" />

          <Text className="mt-8 text-base font-semibold text-white">
            Scan your gym's QR code
          </Text>

          <Text className="mt-2 px-10 text-center text-sm text-white/60">
            Position the QR code inside the frame
          </Text>
        </View>
        {joinError && (
          <View className="absolute bottom-20 left-5 right-5 rounded-2xl border border-red-500/30 bg-black/90 px-5 py-4">
            <Text className="text-center text-sm font-bold text-red-400">
              Invalid QR code
            </Text>

            <Text className="mt-1 text-center text-xs leading-5 text-white/70">
              Please scan the QR code provided by your gym to join.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
