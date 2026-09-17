import { ActivityIndicator, Text, TextInput, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type GymSettingsFormProps = {
  name: string;
  city: string;
  saving: boolean;
  onNameChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onSave: () => void;
};

export function GymSettingsForm({
  name,
  city,
  saving,
  onNameChange,
  onCityChange,
  onSave,
}: GymSettingsFormProps) {
  return (
    <>
      {/* Section heading */}

      <View className="mt-8">
        <Text className="text-lg font-bold text-primary">
          Basic information
        </Text>

        <Text className="mt-1 text-sm text-secondary">
          Update the information members see about your gym.
        </Text>
      </View>

      {/* Form */}

      <Card className="mt-4">
        {/* Gym name */}

        <View>
          <Text className="mb-2 text-sm font-semibold text-primary">
            Gym name
          </Text>

          <TextInput
            value={name}
            onChangeText={onNameChange}
            placeholder="Enter gym name"
            placeholderTextColor="#888888"
            editable={!saving}
            autoCapitalize="words"
            returnKeyType="next"
            className="rounded-xl border border-border bg-background px-4 py-4 text-base text-primary"
          />
        </View>

        {/* City */}

        <View className="mt-5">
          <Text className="mb-2 text-sm font-semibold text-primary">City</Text>

          <TextInput
            value={city}
            onChangeText={onCityChange}
            placeholder="Enter city"
            placeholderTextColor="#888888"
            editable={!saving}
            autoCapitalize="words"
            returnKeyType="done"
            className="rounded-xl border border-border bg-background px-4 py-4 text-base text-primary"
          />
        </View>
      </Card>

      {/* Save */}

      <View className="mt-6">
        <Button onPress={onSave} disabled={saving}>
          {saving ? (
            <View className="flex-row items-center justify-center">
              <ActivityIndicator size="small" color="white" />

              <Text className="ml-2 font-semibold text-white">Saving...</Text>
            </View>
          ) : (
            "Save changes"
          )}
        </Button>
      </View>
    </>
  );
}
