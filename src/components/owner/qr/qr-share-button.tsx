import * as Sharing from "expo-sharing";
import { useState } from "react";
import type { View } from "react-native";
import { ActivityIndicator, Alert, Pressable, Text } from "react-native";
import { captureRef } from "react-native-view-shot";

type QrShareButtonProps = {
  qrRef: React.RefObject<View | null>;
  qrType: "join" | "attendance";
  gymName: string;
};

export function QrShareButton({ qrRef, qrType, gymName }: QrShareButtonProps) {
  const [sharing, setSharing] = useState(false);

  const handleShare = async () => {
    if (!qrRef.current || sharing) {
      return;
    }

    try {
      setSharing(true);

      // Capture the QR card as an image.
      const imageUri = await captureRef(qrRef, {
        format: "png",
        quality: 1,
        result: "tmpfile",
      });

      const canShare = await Sharing.isAvailableAsync();

      if (!canShare) {
        Alert.alert(
          "Sharing unavailable",
          "Sharing is not available on this device.",
        );
        return;
      }

      const title =
        qrType === "join"
          ? `Join ${gymName} on GymApp`
          : `Attendance QR - ${gymName}`;

      await Sharing.shareAsync(imageUri, {
        mimeType: "image/png",
        dialogTitle: title,
        UTI: "public.png",
      });
    } catch (error) {
      console.error("Failed to share QR code:", error);

      Alert.alert(
        "Unable to share",
        "Something went wrong while preparing the QR code.",
      );
    } finally {
      setSharing(false);
    }
  };

  return (
    <Pressable
      onPress={handleShare}
      disabled={sharing}
      className={`h-14 items-center justify-center rounded-xl ${
        sharing ? "bg-surface-light" : "bg-accent"
      }`}
    >
      {sharing ? (
        <ActivityIndicator />
      ) : (
        <Text className="text-base font-bold text-black">Share QR Code</Text>
      )}
    </Pressable>
  );
}
