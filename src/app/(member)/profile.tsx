import { router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";

import { Card } from "@/components/ui/card";
import { Screen } from "@/components/ui/screen";
import { useAuthStore } from "@/store/auth-store";

export default function ProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    try {
      await logout();

      router.replace("/(auth)/role-selection");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  return (
    <Screen className="px-0">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-5 pb-10"
      >
        {/* Header */}
        <View className="pt-5">
          <Text className="text-3xl font-bold text-primary">Profile</Text>

          <Text className="mt-1 text-sm text-secondary">
            Manage your account
          </Text>
        </View>

        {/* Profile Card */}
        <Card className="mt-7">
          <View className="items-center">
            {/* Avatar */}
            <View className="h-20 w-20 items-center justify-center rounded-full bg-accent/15">
              <Text className="text-3xl font-bold text-accent">
                {user?.name?.charAt(0)?.toUpperCase() || "M"}
              </Text>
            </View>

            {/* Name */}
            <Text className="mt-4 text-2xl font-bold text-primary">
              {user?.name || "Member"}
            </Text>

            {/* Phone */}
            <Text className="mt-1 text-sm text-secondary">
              {user?.phone || "No phone number"}
            </Text>

            {/* Role */}
            <View className="mt-4 rounded-full bg-accent/15 px-4 py-2">
              <Text className="text-xs font-bold uppercase text-accent">
                {user?.role || "member"}
              </Text>
            </View>
          </View>
        </Card>

        {/* Account */}
        <Text className="mb-3 mt-8 text-lg font-bold text-primary">
          Account
        </Text>

        <Card className="p-0">
          {/* Name */}
          <View className="flex-row items-center justify-between px-4 py-5">
            <View>
              <Text className="text-xs text-secondary">NAME</Text>

              <Text className="mt-1 text-base font-semibold text-primary">
                {user?.name || "Not set"}
              </Text>
            </View>
          </View>

          <View className="border-t border-border" />

          {/* Phone */}
          <View className="flex-row items-center justify-between px-4 py-5">
            <View>
              <Text className="text-xs text-secondary">PHONE</Text>

              <Text className="mt-1 text-base font-semibold text-primary">
                {user?.phone || "Not available"}
              </Text>
            </View>
          </View>

          <View className="border-t border-border" />

          {/* Role */}
          <View className="flex-row items-center justify-between px-4 py-5">
            <View>
              <Text className="text-xs text-secondary">ACCOUNT TYPE</Text>

              <Text className="mt-1 text-base font-semibold capitalize text-primary">
                {user?.role || "Member"}
              </Text>
            </View>
          </View>
        </Card>

        {/* Settings */}
        <Text className="mb-3 mt-8 text-lg font-bold text-primary">
          Settings
        </Text>

        <Card className="p-0">
          <Pressable
            onPress={() => {}}
            className="flex-row items-center justify-between px-4 py-5"
          >
            <View>
              <Text className="text-base font-semibold text-primary">
                Notifications
              </Text>

              <Text className="mt-1 text-sm text-secondary">
                Manage notification preferences
              </Text>
            </View>

            <Text className="text-xl text-secondary">›</Text>
          </Pressable>

          <View className="border-t border-border" />

          <Pressable
            onPress={() => {}}
            className="flex-row items-center justify-between px-4 py-5"
          >
            <View>
              <Text className="text-base font-semibold text-primary">
                Help & Support
              </Text>

              <Text className="mt-1 text-sm text-secondary">
                Get help with your account
              </Text>
            </View>

            <Text className="text-xl text-secondary">›</Text>
          </Pressable>
        </Card>

        {/* Logout */}
        <Pressable
          onPress={handleLogout}
          className="mt-8 items-center rounded-xl border border-red-500/30 bg-red-500/10 py-4"
        >
          <Text className="font-bold text-red-400">Log out</Text>
        </Pressable>

        {/* App Version */}
        <Text className="mt-6 text-center text-xs text-secondary">GymApp</Text>
      </ScrollView>
    </Screen>
  );
}
