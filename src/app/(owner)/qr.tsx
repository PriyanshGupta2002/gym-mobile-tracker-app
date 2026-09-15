import { router } from "expo-router";
import { useRef, useState } from "react";
import { ScrollView, Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Screen } from "@/components/ui/screen";

import { QrCodeCard } from "@/components/owner/qr/qr-code-card";
import { QrHeader } from "@/components/owner/qr/qr-header";
import { QrOptionCard } from "@/components/owner/qr/qr-option-card";
import { QrShareButton } from "@/components/owner/qr/qr-share-button";

import { useOwnerStore } from "@/store/owner-store";

type QrType = "join" | "attendance";

export default function OwnerQrScreen() {
  const selectedGym = useOwnerStore((state) => state.selectedGym);

  const [qrType, setQrType] = useState<QrType>("join");

  const qrRef = useRef<View | null>(null);

  // ---------------------------------------------------------
  // No gym selected
  // ---------------------------------------------------------

  if (!selectedGym) {
    return (
      <Screen>
        <View className="flex-1 px-5 pt-8">
          <Text className="text-3xl font-bold text-primary">
            No gym selected
          </Text>

          <Text className="mt-3 text-base leading-6 text-secondary">
            Select a gym before generating a QR code.
          </Text>

          <View className="mt-6">
            <Button onPress={() => router.replace("/(owner)")}>
              Select Gym
            </Button>
          </View>
        </View>
      </Screen>
    );
  }

  // ---------------------------------------------------------
  // QR payload
  // ---------------------------------------------------------

  const qrValue = `gymapp://${qrType}?gym_id=${selectedGym.id}`;

  // ---------------------------------------------------------
  // Screen
  // ---------------------------------------------------------

  return (
    <Screen>
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pt-6 pb-10"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <QrHeader gymName={selectedGym.name} city={selectedGym.city} />

        {/* QR Type Selection */}
        <View className="mt-8">
          <Text className="mb-3 text-sm font-semibold text-primary">
            Choose QR type
          </Text>

          <QrOptionCard
            title="Join Gym"
            description="Members scan this QR code to join your gym."
            icon="people-outline"
            selected={qrType === "join"}
            onPress={() => setQrType("join")}
          />

          <View className="mt-3">
            <QrOptionCard
              title="Attendance"
              description="Members scan this QR code to mark their attendance."
              icon="qr-code-outline"
              selected={qrType === "attendance"}
              onPress={() => setQrType("attendance")}
            />
          </View>
        </View>

        {/* QR Code */}
        <View className="mt-6">
          <QrCodeCard
            ref={qrRef}
            value={qrValue}
            title={qrType === "join" ? "Join this gym" : "Mark attendance"}
            description={
              qrType === "join"
                ? "Scan this code to join the gym"
                : "Scan this code to check in"
            }
          />
        </View>

        {/* Share QR */}
        <View className="mt-5">
          <QrShareButton
            qrRef={qrRef}
            qrType={qrType}
            gymName={selectedGym.name}
          />
        </View>

        {/* Back */}
        <View className="mt-4">
          <Button variant="outline" onPress={() => router.back()}>
            Back
          </Button>
        </View>
      </ScrollView>
    </Screen>
  );
}
