import { router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";

import { Screen } from "@/components/ui/screen";

import { MoreGymCard } from "@/components/owner/more/more-gym-card";
import { MoreHeader } from "@/components/owner/more/more-header";
import { MoreMenuItem } from "@/components/owner/more/more-menu-item";
import { MoreSection } from "@/components/owner/more/more-section";

import { useAuthStore } from "@/store/auth-store";
import { useOwnerStore } from "@/store/owner-store";

export default function OwnerMoreScreen() {
  const selectedGym = useOwnerStore((state) => state.selectedGym);
  const selectGym = useOwnerStore((state) => state.selectGym);
  const logout = useAuthStore((state) => state.logout);
  const gyms = useOwnerStore((state) => state.gyms);

  const handleLogout = async () => {
    try {
      useOwnerStore.getState().clearGyms();

      await logout();

      router.replace("/(auth)/role-selection");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  return (
    <Screen>
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pb-10 pt-6"
        showsVerticalScrollIndicator={false}
      >
        <MoreHeader gymName={selectedGym?.name} />

        {selectedGym && (
          <MoreGymCard gymName={selectedGym.name} city={selectedGym.city} />
        )}

        {/* Gym Management */}

        <MoreSection title="GYM MANAGEMENT">
          <MoreMenuItem
            title="Membership Plans"
            description="Create and manage the plans offered by your gym."
            icon="card-outline"
            onPress={() => router.push("/(owner)/membership-plans")}
          />

          <MoreMenuItem
            title="Staff"
            description="Manage your gym staff and access."
            icon="people-outline"
            onPress={() => router.push("/(owner)/staff")}
          />

          <MoreMenuItem
            title="Gym Settings"
            description="Manage your gym information and settings."
            icon="settings-outline"
            onPress={() => router.push("/(owner)/gym-settings")}
          />
        </MoreSection>

        {/* Operations */}

        <MoreSection title="OPERATIONS">
          <MoreMenuItem
            title="Attendance"
            description="View attendance activity and member check-ins."
            icon="calendar-outline"
            onPress={() => router.push("/(owner)/attendance")}
          />

          <MoreMenuItem
            title="Renewals"
            description="See memberships that are expiring or need renewal."
            icon="refresh-outline"
            onPress={() => router.push("/(owner)/renewals")}
          />

          <MoreMenuItem
            title="Payments"
            description="View membership payments and payment history."
            icon="cash-outline"
            onPress={() => router.push("/(owner)/payments")}
          />
        </MoreSection>

        {/* My Gyms */}
        <MoreSection title="MY GYMS">
          {gyms.map((gym) => {
            const isSelected = selectedGym?.id === gym.id;

            return (
              <Pressable
                key={gym.id}
                onPress={() => selectGym(gym.id)}
                className="mb-3"
              >
                <View
                  className={`rounded-2xl border p-4 ${
                    isSelected
                      ? "border-accent bg-accent/10"
                      : "border-border bg-card"
                  }`}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="text-base font-bold text-primary">
                        {gym.name}
                      </Text>

                      <Text className="mt-1 text-sm text-secondary">
                        {gym.city}
                      </Text>
                    </View>

                    {isSelected && (
                      <View className="rounded-full bg-accent/15 px-3 py-1">
                        <Text className="text-xs font-semibold text-accent">
                          Selected
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </Pressable>
            );
          })}

          {/* Add Gym */}
          <MoreMenuItem
            title="Add another gym"
            description="Create and manage another gym you own."
            icon="add-circle-outline"
            onPress={() => router.push("/(auth)/gym-setup")}
          />
        </MoreSection>

        {/* Logout */}

        <View className="mt-8">
          <Pressable
            onPress={handleLogout}
            className="items-center rounded-xl border border-red-500/30 bg-red-500/10 py-4"
          >
            <Text className="font-bold text-red-400">Log out</Text>
          </Pressable>
        </View>

        {/* App Version */}

        <Text className="mt-6 text-center text-xs text-secondary">GymApp</Text>
      </ScrollView>
    </Screen>
  );
}
