import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Screen } from "@/components/ui/screen";

import { getCurrentUser } from "@/services/auth";
import { getGymMemberships, type GymMembershipsResponse } from "@/services/gym";

import { useAuthStore } from "@/store/auth-store";
import { useOwnerStore } from "@/store/owner-store";

export default function OwnerHomeScreen() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  // ---------------------------------------------------------
  // Owner store
  // ---------------------------------------------------------

  const gyms = useOwnerStore((state) => state.gyms);
  const selectedGym = useOwnerStore((state) => state.selectedGym);

  const setGyms = useOwnerStore((state) => state.setGyms);
  const selectGym = useOwnerStore((state) => state.selectGym);

  // ---------------------------------------------------------
  // Page state
  // ---------------------------------------------------------

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Gym-specific data
  const [memberships, setMemberships] = useState<GymMembershipsResponse | null>(
    null,
  );

  const [membershipsLoading, setMembershipsLoading] = useState(false);
  const [membershipsError, setMembershipsError] = useState("");

  // ---------------------------------------------------------
  // Load owner's gyms
  // ---------------------------------------------------------

  useEffect(() => {
    const loadOwnerData = async () => {
      try {
        setLoading(true);
        setError("");

        const me = await getCurrentUser();

        // /users/me is the source of truth for owner gyms.
        setGyms(me.gym ?? []);
      } catch (error) {
        console.error("Failed to fetch owner data:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load your gym information.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadOwnerData();
  }, [setGyms]);

  // ---------------------------------------------------------
  // Load data whenever selected gym changes
  // ---------------------------------------------------------

  useEffect(() => {
    if (!selectedGym?.id) {
      setMemberships(null);
      return;
    }

    const loadGymData = async () => {
      try {
        setMembershipsLoading(true);
        setMembershipsError("");

        const response = await getGymMemberships(selectedGym.id);

        setMemberships(response);
      } catch (error) {
        console.error("Failed to fetch gym memberships:", error);

        setMembershipsError(
          error instanceof Error
            ? error.message
            : "Unable to load gym members.",
        );

        setMemberships(null);
      } finally {
        setMembershipsLoading(false);
      }
    };

    loadGymData();
  }, [selectedGym?.id]);

  // ---------------------------------------------------------
  // Logout
  // ---------------------------------------------------------

  const handleLogout = async () => {
    useOwnerStore.getState().clearGyms();

    await logout();

    router.replace("/(auth)/role-selection");
  };

  // ---------------------------------------------------------
  // Retry
  // ---------------------------------------------------------

  const handleRetry = () => {
    router.replace("/(owner)");
  };

  // ---------------------------------------------------------
  // Loading
  // ---------------------------------------------------------

  if (loading) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center px-5">
          <Text className="text-base text-secondary">Loading your gyms...</Text>
        </View>
      </Screen>
    );
  }

  // ---------------------------------------------------------
  // Error
  // ---------------------------------------------------------

  if (error) {
    return (
      <Screen>
        <View className="flex-1 px-1 pt-6">
          <Text className="text-3xl font-bold text-primary">
            Something went wrong
          </Text>

          <Text className="mt-3 text-base leading-6 text-secondary">
            {error}
          </Text>

          <View className="mt-6">
            <Button onPress={handleRetry}>Try again</Button>
          </View>

          <View className="mt-4">
            <Button onPress={handleLogout}>Logout</Button>
          </View>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View className="flex-1 px-1 pt-6">
        {/* Header */}

        <View>
          <Text className="text-base text-secondary">Good morning</Text>

          <Text className="mt-1 text-3xl font-bold text-primary">
            {user?.name ?? "Owner"} 👋
          </Text>
        </View>

        {/* Logout */}

        <View className="mt-4">
          <Button onPress={handleLogout}>Logout</Button>
        </View>

        {/* Gym selector */}

        <View className="mt-8">
          <Text className="text-sm font-semibold text-primary">Your gyms</Text>

          {gyms.length === 0 ? (
            <Card className="mt-3">
              <Text className="text-base font-semibold text-primary">
                No gyms yet
              </Text>

              <Text className="mt-1 text-sm leading-5 text-secondary">
                You haven't created a gym yet.
              </Text>

              <View className="mt-4">
                <Button onPress={() => router.push("/(auth)/gym-setup")}>
                  Create gym
                </Button>
              </View>
            </Card>
          ) : (
            <View className="mt-3">
              {gyms.map((gym) => {
                const isSelected = selectedGym?.id === gym.id;

                return (
                  <Pressable
                    key={gym.id}
                    onPress={() => selectGym(gym.id)}
                    className="mb-3"
                  >
                    <Card
                      className={
                        isSelected
                          ? "border-2 border-accent"
                          : "border border-border"
                      }
                    >
                      <View className="flex-row items-center justify-between">
                        <View className="flex-1">
                          <Text className="text-lg font-bold text-primary">
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
                    </Card>
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>

        {/* Selected gym */}

        {selectedGym && (
          <View className="mt-5">
            <Text className="text-sm font-semibold text-primary">
              Selected gym
            </Text>

            <Card className="mt-3">
              <Text className="text-sm text-secondary">Gym name</Text>

              <Text className="mt-1 text-2xl font-bold text-primary">
                {selectedGym.name}
              </Text>

              <View className="mt-5">
                <Text className="text-sm text-secondary">Location</Text>

                <Text className="mt-1 text-base font-semibold text-primary">
                  {selectedGym.city}
                </Text>
              </View>
            </Card>
          </View>
        )}

        {/* Dashboard */}

        {selectedGym && (
          <View className="mt-5">
            <Text className="text-sm font-semibold text-primary">
              {selectedGym.name} dashboard
            </Text>

            {/* Active members */}

            <Card className="mt-3">
              <Text className="text-sm text-secondary">Active members</Text>

              {membershipsLoading ? (
                <Text className="mt-2 text-base text-secondary">
                  Loading...
                </Text>
              ) : membershipsError ? (
                <Text className="mt-2 text-sm text-secondary">
                  {membershipsError}
                </Text>
              ) : (
                <>
                  <Text className="mt-1 text-4xl font-bold text-accent">
                    {memberships?.total ?? 0}
                  </Text>

                  <Text className="mt-2 text-sm text-secondary">
                    Members registered at this gym.
                  </Text>
                </>
              )}
            </Card>

            {/* Today's attendance */}

            <Card className="mt-4">
              <Text className="text-sm text-secondary">Today's attendance</Text>

              <Text className="mt-1 text-4xl font-bold text-accent">
                {memberships?.today_attendance || "-"}
              </Text>

              <Text className="mt-2 text-sm text-secondary">
                Attendance data will be connected to this gym.
              </Text>
            </Card>
          </View>
        )}
      </View>
    </Screen>
  );
}
