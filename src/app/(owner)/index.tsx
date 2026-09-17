import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Screen } from "@/components/ui/screen";

import { getCurrentUser, type CurrentUserResponse } from "@/services/auth";
import { getGymMemberships, type GymMembershipsResponse } from "@/services/gym";

import { useOwnerStore } from "@/store/owner-store";

export default function OwnerHomeScreen() {
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

  const [currentUser, setCurrentUser] = useState<CurrentUserResponse | null>(
    null,
  );

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // ---------------------------------------------------------
  // Gym-specific data
  // ---------------------------------------------------------

  const [memberships, setMemberships] = useState<GymMembershipsResponse | null>(
    null,
  );

  const [membershipsLoading, setMembershipsLoading] = useState(false);
  const [membershipsError, setMembershipsError] = useState("");

  // ---------------------------------------------------------
  // Load owner data
  // ---------------------------------------------------------

  const loadOwnerData = async (showLoader = false) => {
    try {
      if (showLoader) {
        setLoading(true);
      }

      setError("");

      const me = await getCurrentUser();

      // /users/me is the source of truth
      setCurrentUser(me);
      setGyms(me.gym ?? []);
    } catch (error) {
      console.error("Failed to fetch owner data:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load your gym information.",
      );
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  };

  // ---------------------------------------------------------
  // Load selected gym data
  // ---------------------------------------------------------

  const loadGymData = async () => {
    if (!selectedGym?.id) {
      setMemberships(null);
      return;
    }

    try {
      setMembershipsLoading(true);
      setMembershipsError("");

      const response = await getGymMemberships(selectedGym.id);

      setMemberships(response);
    } catch (error) {
      console.error("Failed to fetch gym memberships:", error);

      setMembershipsError(
        error instanceof Error ? error.message : "Unable to load gym members.",
      );

      setMemberships(null);
    } finally {
      setMembershipsLoading(false);
    }
  };

  // ---------------------------------------------------------
  // Initial load
  // ---------------------------------------------------------

  useEffect(() => {
    const load = async () => {
      await loadOwnerData(true);
    };

    load();
  }, []);

  // ---------------------------------------------------------
  // Load data whenever selected gym changes
  // ---------------------------------------------------------

  useEffect(() => {
    loadGymData();
  }, [selectedGym?.id]);

  // ---------------------------------------------------------
  // Pull to refresh
  // ---------------------------------------------------------

  const handleRefresh = async () => {
    try {
      setRefreshing(true);

      // Refresh /users/me
      await loadOwnerData(false);

      // Refresh selected gym dashboard
      await loadGymData();
    } finally {
      setRefreshing(false);
    }
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
        </View>
      </Screen>
    );
  }

  // ---------------------------------------------------------
  // Screen
  // ---------------------------------------------------------

  return (
    <Screen className="px-0">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-5 pb-10 pt-6"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Header */}

        <View>
          <Text className="text-base text-secondary">Good morning</Text>

          <Text className="mt-1 text-3xl font-bold text-primary">
            {currentUser?.name ?? "Owner"} 👋
          </Text>
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
      </ScrollView>
    </Screen>
  );
}
