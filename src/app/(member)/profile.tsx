import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import { Screen } from "@/components/ui/screen";
import { getCurrentUser, type CurrentUserResponse } from "@/services/auth";
import { useAuthStore } from "@/store/auth-store";

import { MembershipSummaryCard } from "@/components/member/profile/membership-summary-card";
import { ProfileActionCard } from "@/components/member/profile/profile-action-card";
import { ProfileHeader } from "@/components/member/profile/profile-header";
import { ProfileInfoCard } from "@/components/member/profile/profile-info-card";

export default function ProfileScreen() {
  const logout = useAuthStore((state) => state.logout);

  const [user, setUser] = useState<CurrentUserResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    try {
      const me = await getCurrentUser();
      setUser(me);
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/(auth)/role-selection");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  if (loading) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />

          <Text className="mt-4 text-sm text-secondary">
            Loading profile...
          </Text>
        </View>
      </Screen>
    );
  }

  if (!user) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-xl font-bold text-primary">
            Unable to load profile
          </Text>

          <Text className="mt-2 text-center text-sm text-secondary">
            Please try again.
          </Text>

          <Pressable
            onPress={loadProfile}
            className="mt-5 rounded-xl bg-accent px-6 py-3"
          >
            <Text className="font-bold text-white">Try Again</Text>
          </Pressable>
        </View>
      </Screen>
    );
  }

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

        {/* Profile Header */}
        <ProfileHeader
          name={user.name || ""}
          phone={user.phone}
          role={user.role}
        />

        {/* Membership */}
        <Text className="mb-3 mt-8 text-lg font-bold text-primary">
          Your Membership
        </Text>

        <MembershipSummaryCard membership={user.membership} />

        {/* Account */}
        <Text className="mb-3 mt-8 text-lg font-bold text-primary">
          Account
        </Text>

        <ProfileInfoCard name={user.name || ""} phone={user.phone} />

        {/* Settings */}
        <Text className="mb-3 mt-8 text-lg font-bold text-primary">
          Settings
        </Text>

        <ProfileActionCard
          onNotifications={() => {
            // TODO
          }}
          onHelp={() => {
            // TODO
          }}
        />

        {/* Logout */}
        <Pressable
          onPress={handleLogout}
          className="mt-8 items-center rounded-xl border border-red-500/30 bg-red-500/10 py-4"
        >
          <Text className="font-bold text-red-400">Log out</Text>
        </Pressable>

        <Text className="mt-6 text-center text-xs text-secondary">GymApp</Text>
      </ScrollView>
    </Screen>
  );
}
