import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Pressable,
  Text,
  View,
} from "react-native";

import { createGym } from "@/services/gym";
import { getIndianCities, type City } from "@/services/location";

import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Screen } from "../../components/ui/screen";

const PAGE_SIZE = 10;
const SEARCH_DEBOUNCE = 300;

export default function GymSetupScreen() {
  const [gymName, setGymName] = useState("");
  const [city, setCity] = useState("");

  const [cities, setCities] = useState<City[]>([]);
  const [search, setSearch] = useState("");

  const [cityPickerOpen, setCityPickerOpen] = useState(false);

  const [citiesLoading, setCitiesLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [creatingGym, setCreatingGym] = useState(false);

  const [cityError, setCityError] = useState("");
  const [error, setError] = useState("");

  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);

  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasMore = cities.length < total;

  /**
   * Load the first page of cities.
   */
  const loadCities = async (searchValue = "") => {
    try {
      setCitiesLoading(true);
      setCityError("");

      const response = await getIndianCities({
        search: searchValue.trim() || undefined,
        limit: PAGE_SIZE,
        offset: 0,
      });

      setCities(response.cities);
      setTotal(response.total);
      setOffset(PAGE_SIZE);
    } catch (error) {
      console.error("Failed to load cities:", error);

      setCityError(
        error instanceof Error
          ? error.message
          : "Unable to load cities. Please try again.",
      );
    } finally {
      setCitiesLoading(false);
    }
  };

  /**
   * Load the next page when the user reaches
   * the bottom of the city list.
   */
  const loadMoreCities = async () => {
    if (citiesLoading || loadingMore || !hasMore) {
      return;
    }

    try {
      setLoadingMore(true);
      setCityError("");

      const response = await getIndianCities({
        search: search.trim() || undefined,
        limit: PAGE_SIZE,
        offset,
      });

      setCities((current) => [...current, ...response.cities]);

      setTotal(response.total);
      setOffset((current) => current + response.cities.length);
    } catch (error) {
      console.error("Failed to load more cities:", error);

      setCityError(
        error instanceof Error ? error.message : "Unable to load more cities.",
      );
    } finally {
      setLoadingMore(false);
    }
  };

  /**
   * Open city picker.
   */
  const handleOpenCityPicker = () => {
    setCityPickerOpen(true);

    if (cities.length === 0) {
      loadCities();
    }
  };

  /**
   * Search cities with debounce.
   */
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCityError("");

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      loadCities(value);
    }, SEARCH_DEBOUNCE);
  };

  /**
   * Select a city.
   */
  const handleSelectCity = (selectedCity: City) => {
    setCity(selectedCity.name);
    setCityPickerOpen(false);

    Keyboard.dismiss();
  };

  /**
   * Create gym.
   */
  const handleCreateGym = async () => {
    const trimmedGymName = gymName.trim();
    const trimmedCity = city.trim();

    if (!trimmedGymName || !trimmedCity || creatingGym) {
      return;
    }

    try {
      setCreatingGym(true);
      setError("");

      const gym = await createGym(trimmedGymName, trimmedCity);

      console.log("Gym created successfully:", gym);

      router.replace("/(owner)");
    } catch (error) {
      console.error("Failed to create gym:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to create gym. Please try again.",
      );
    } finally {
      setCreatingGym(false);
    }
  };

  /**
   * Cleanup debounce timer.
   */
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  /**
   * City picker screen.
   */
  if (cityPickerOpen) {
    return (
      <Screen>
        <View className="flex-1 px-1">
          <View className="mt-8">
            <Pressable
              onPress={() => {
                setCityPickerOpen(false);
                Keyboard.dismiss();
              }}
            >
              <Text className="text-base font-semibold text-accent">
                ← Back
              </Text>
            </Pressable>

            <Text className="mt-6 text-3xl font-bold text-primary">
              Select your city
            </Text>

            <Text className="mt-2 text-base text-secondary">
              Search for the city where your gym is located.
            </Text>
          </View>

          <View className="mt-6">
            <Input
              placeholder="Search city..."
              value={search}
              onChangeText={handleSearchChange}
              autoFocus
              autoCapitalize="words"
              returnKeyType="search"
            />
          </View>

          {cityError ? (
            <Text className="mt-4 text-sm font-medium text-red-500">
              {cityError}
            </Text>
          ) : null}

          <View className="mt-5 flex-1">
            {citiesLoading ? (
              <View className="items-center py-8">
                <ActivityIndicator />

                <Text className="mt-3 text-sm text-secondary">
                  Loading cities...
                </Text>
              </View>
            ) : (
              <FlatList
                data={cities}
                keyExtractor={(item, index) => `${item.name}-${index}`}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                onEndReached={loadMoreCities}
                onEndReachedThreshold={0.5}
                ListEmptyComponent={
                  <View className="items-center py-10">
                    <Text className="text-base text-secondary">
                      No cities found.
                    </Text>
                  </View>
                }
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => handleSelectCity(item)}
                    className="border-b border-border py-4"
                  >
                    <Text className="text-base font-semibold text-primary">
                      {item.name}
                    </Text>
                  </Pressable>
                )}
                ListFooterComponent={
                  loadingMore ? (
                    <View className="items-center py-5">
                      <ActivityIndicator />

                      <Text className="mt-2 text-sm text-secondary">
                        Loading more cities...
                      </Text>
                    </View>
                  ) : hasMore ? (
                    <View className="py-5">
                      <Text className="text-center text-xs text-secondary">
                        Scroll for more cities
                      </Text>
                    </View>
                  ) : cities.length > 0 ? (
                    <View className="py-5">
                      <Text className="text-center text-xs text-secondary">
                        No more cities
                      </Text>
                    </View>
                  ) : null
                }
              />
            )}
          </View>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View className="flex-1 px-1">
        {/* Header */}
        <View className="mt-10">
          <View className="mb-4 self-start rounded-full bg-accent/15 px-4 py-2">
            <Text className="text-sm font-semibold text-accent">GYM OWNER</Text>
          </View>

          <Text className="text-4xl font-bold leading-tight text-primary">
            Set up your gym
          </Text>

          <Text className="mt-3 text-base leading-6 text-secondary">
            Add a few details about your gym to get started.
          </Text>
        </View>

        {/* Form */}
        <View className="mt-10">
          <Card>
            <Text className="text-lg font-bold text-primary">Gym details</Text>

            {/* Gym name */}
            <View className="mt-6">
              <Text className="mb-2 text-sm font-semibold text-primary">
                Gym name
              </Text>

              <Input
                placeholder="e.g. Fitness Hub"
                value={gymName}
                onChangeText={(value) => {
                  setGymName(value);

                  if (error) {
                    setError("");
                  }
                }}
                autoCapitalize="words"
                editable={!creatingGym}
              />
            </View>

            {/* City */}
            <View className="mt-5">
              <Text className="mb-2 text-sm font-semibold text-primary">
                City
              </Text>

              <Pressable onPress={handleOpenCityPicker} disabled={creatingGym}>
                <View className="h-14 justify-center rounded-xl border border-border bg-surface px-4">
                  <Text
                    className={
                      city
                        ? "text-base text-primary"
                        : "text-base text-secondary"
                    }
                  >
                    {city || "Select your city"}
                  </Text>
                </View>
              </Pressable>
            </View>

            {/* Error */}
            {error ? (
              <Text className="mt-4 text-sm font-medium text-red-500">
                {error}
              </Text>
            ) : null}

            {/* Create Gym */}
            <View className="mt-6">
              <Button
                onPress={handleCreateGym}
                disabled={!gymName.trim() || !city.trim() || creatingGym}
                loading={creatingGym}
              >
                Create Gym
              </Button>
            </View>
          </Card>
        </View>
      </View>
    </Screen>
  );
}
