import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { toast } from "sonner-native";

import { Button } from "@/components/ui/button";
import { Screen } from "@/components/ui/screen";

import { GymSettingsForm } from "@/components/owner/gym-settings/gym-settings-form";
import { GymSettingsHeader } from "@/components/owner/gym-settings/gym-settings-header";
import { GymSettingsInfo } from "@/components/owner/gym-settings/gym-settings-info";
import { GymSettingsOverview } from "@/components/owner/gym-settings/gym-settings-overview";

import { updateGym as updateGymApi } from "@/services/gym";
import { useOwnerStore } from "@/store/owner-store";

export default function GymSettingsScreen() {
  const selectedGym = useOwnerStore((state) => state.selectedGym);

  const updateGymInStore = useOwnerStore((state) => state.updateGym);

  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [saving, setSaving] = useState(false);

  // ---------------------------------------------------------
  // Populate form
  // ---------------------------------------------------------

  useEffect(() => {
    if (!selectedGym) {
      return;
    }

    setName(selectedGym.name);
    setCity(selectedGym.city);
  }, [selectedGym]);

  // ---------------------------------------------------------
  // Save
  // ---------------------------------------------------------

  const handleSave = async () => {
    if (!selectedGym) {
      return;
    }

    const trimmedName = name.trim();
    const trimmedCity = city.trim();

    // -------------------------------------------------------
    // Validation
    // -------------------------------------------------------

    if (!trimmedName) {
      toast.error("Gym name is required");
      return;
    }

    if (!trimmedCity) {
      toast.error("City is required");
      return;
    }

    // -------------------------------------------------------
    // No changes
    // -------------------------------------------------------

    if (trimmedName === selectedGym.name && trimmedCity === selectedGym.city) {
      toast.info("No changes to save");
      return;
    }

    try {
      setSaving(true);

      // -----------------------------------------------------
      // Update backend
      // -----------------------------------------------------

      const updatedGym = await updateGymApi(selectedGym.id, {
        name: trimmedName,
        city: trimmedCity,
      });

      // -----------------------------------------------------
      // Update local Zustand state
      // -----------------------------------------------------

      updateGymInStore(updatedGym);

      // -----------------------------------------------------
      // Success
      // -----------------------------------------------------

      toast.success("Gym updated successfully");

      router.back();
    } catch (error) {
      console.error("Failed to update gym:", error);

      toast.error(
        error instanceof Error ? error.message : "Unable to update gym.",
      );
    } finally {
      setSaving(false);
    }
  };

  // ---------------------------------------------------------
  // No selected gym
  // ---------------------------------------------------------

  if (!selectedGym) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-3xl">🏋️</Text>

          <Text className="mt-5 text-center text-2xl font-bold text-primary">
            No gym selected
          </Text>

          <Text className="mt-2 text-center text-sm leading-5 text-secondary">
            Select a gym before opening gym settings.
          </Text>

          <View className="mt-6 w-full">
            <Button onPress={() => router.back()}>Go back</Button>
          </View>
        </View>
      </Screen>
    );
  }

  // ---------------------------------------------------------
  // Screen
  // ---------------------------------------------------------

  return (
    <Screen className="px-0">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerClassName="px-5 pb-10 pt-5"
        >
          <GymSettingsHeader />

          <GymSettingsOverview
            name={selectedGym.name}
            city={selectedGym.city}
          />

          <GymSettingsForm
            name={name}
            city={city}
            saving={saving}
            onNameChange={setName}
            onCityChange={setCity}
            onSave={handleSave}
          />

          <GymSettingsInfo />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
