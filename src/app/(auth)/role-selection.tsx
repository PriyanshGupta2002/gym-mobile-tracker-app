import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { Screen } from "@/components/ui/screen";

export default function RoleSelectionScreen() {
  return (
    <Screen>
      <View className="flex-1 px-6">
        {/* Header */}
        <View className="pt-10">
          <Text className="text-4xl font-bold text-primary">Welcome 👋</Text>

          <Text className="mt-3 text-base text-secondary">
            How will you use GymApp?
          </Text>
        </View>

        {/* Role cards */}
        <View className="mt-12 gap-4">
          {/* Member */}
          <Pressable
            onPress={() => router.push("/(auth)/login?role=member")}
            className="rounded-3xl border border-border bg-surface p-6"
          >
            <Text className="text-4xl">👤</Text>

            <Text className="mt-5 text-2xl font-bold text-primary">
              I'm a Member
            </Text>

            <Text className="mt-2 text-sm leading-5 text-secondary">
              Track your gym membership, attendance and fitness journey.
            </Text>

            <View className="mt-5 self-start rounded-full bg-accent px-4 py-2">
              <Text className="font-semibold text-black">Continue →</Text>
            </View>
          </Pressable>

          {/* Owner */}
          <Pressable
            onPress={() => router.push("/(auth)/login?role=owner")}
            className="rounded-3xl border border-border bg-surface p-6"
          >
            <Text className="text-4xl">🏋️</Text>

            <Text className="mt-5 text-2xl font-bold text-primary">
              I'm a Gym Owner
            </Text>

            <Text className="mt-2 text-sm leading-5 text-secondary">
              Manage your gym, members, memberships and attendance.
            </Text>

            <View className="mt-5 self-start rounded-full bg-accent px-4 py-2">
              <Text className="font-semibold text-black">Continue →</Text>
            </View>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}
