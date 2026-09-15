import { useCallback, useEffect, useState } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";

import { Screen } from "@/components/ui/screen";

import { getGymMemberships, type GymMembershipsResponse } from "@/services/gym";

import { useOwnerStore } from "@/store/owner-store";

import { MembersError } from "@/components/owner/members/member-error";
import { MembersHeader } from "@/components/owner/members/members-header";
import { MembersList } from "@/components/owner/members/members-list";
import { MembersSummaryCard } from "@/components/owner/members/members-summary-card";

export default function OwnerMembersScreen() {
  const selectedGym = useOwnerStore((state) => state.selectedGym);

  const [data, setData] = useState<GymMembershipsResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  console.log(data?.members);

  const loadMembers = useCallback(async () => {
    if (!selectedGym?.id) {
      setData(null);
      setLoading(false);
      return;
    }

    try {
      setError("");

      const response = await getGymMemberships(selectedGym.id);

      setData(response);
    } catch (error) {
      console.error("Failed to fetch gym members:", error);

      setError(
        error instanceof Error ? error.message : "Unable to load gym members.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedGym?.id]);

  useEffect(() => {
    setLoading(true);
    loadMembers();
  }, [loadMembers]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadMembers();
  };

  if (!selectedGym) {
    return (
      <Screen>
        <View className="flex-1 px-5 pt-8">
          <Text className="text-3xl font-bold text-primary">Members</Text>

          <Text className="mt-3 text-sm text-secondary">
            Select a gym from Home to view its members.
          </Text>
        </View>
      </Screen>
    );
  }

  if (loading) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center">
          <Text className="text-base text-secondary">Loading members...</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pb-8 pt-6"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <MembersHeader gymName={selectedGym.name} />

        {error ? (
          <MembersError message={error} onRetry={loadMembers} />
        ) : (
          <>
            <MembersSummaryCard total={data?.total ?? 0} />

            <MembersList
              members={data?.members ?? []}
              gymName={selectedGym.name}
            />
          </>
        )}
      </ScrollView>
    </Screen>
  );
}
