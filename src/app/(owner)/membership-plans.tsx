import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";

import { Screen } from "@/components/ui/screen";

import {
  createMembershipPlan,
  deleteMembershipPlan,
  getMembershipPlans,
  updateMembershipPlan,
  type MembershipPlan,
} from "@/services/membership-plan";

import { useOwnerStore } from "@/store/owner-store";

import { MembershipPlanEmpty } from "@/components/owner/membership-plans/membership-plan-empty";
import { MembershipPlanForm } from "@/components/owner/membership-plans/membership-plan-form";
import { MembershipPlanHeader } from "@/components/owner/membership-plans/membership-plan-header";
import { MembershipPlanList } from "@/components/owner/membership-plans/membership-plan-list";

export default function MembershipPlansScreen() {
  const selectedGym = useOwnerStore((state) => state.selectedGym);

  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);

  const [saving, setSaving] = useState(false);

  // ---------------------------------------------------------
  // Load plans
  // ---------------------------------------------------------

  const loadPlans = useCallback(
    async (showLoader = true) => {
      if (!selectedGym?.id) {
        setPlans([]);
        setLoading(false);
        return;
      }

      try {
        if (showLoader) {
          setLoading(true);
        }

        setError(null);

        const response = await getMembershipPlans(selectedGym.id);

        setPlans(response);
      } catch (error) {
        console.error("Failed to load membership plans:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load membership plans.",
        );
      } finally {
        setLoading(false);
      }
    },
    [selectedGym?.id],
  );

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  // ---------------------------------------------------------
  // Refresh
  // ---------------------------------------------------------

  const handleRefresh = async () => {
    setRefreshing(true);

    try {
      await loadPlans(false);
    } finally {
      setRefreshing(false);
    }
  };

  // ---------------------------------------------------------
  // Open create form
  // ---------------------------------------------------------

  const handleCreate = () => {
    setEditingPlan(null);
    setShowForm(true);
  };

  // ---------------------------------------------------------
  // Open edit form
  // ---------------------------------------------------------

  const handleEdit = (plan: MembershipPlan) => {
    setEditingPlan(plan);
    setShowForm(true);
  };

  // ---------------------------------------------------------
  // Save
  // ---------------------------------------------------------

  const handleSubmit = async (data: {
    name: string;
    duration_days: number;
    price: number;
  }) => {
    if (!selectedGym?.id || saving) {
      return;
    }

    try {
      setSaving(true);
      setError(null);

      if (editingPlan) {
        const updatedPlan = await updateMembershipPlan(
          selectedGym.id,
          editingPlan.id,
          data,
        );

        setPlans((currentPlans) =>
          currentPlans.map((plan) =>
            plan.id === updatedPlan.id ? updatedPlan : plan,
          ),
        );
      } else {
        const newPlan = await createMembershipPlan(selectedGym.id, data);

        setPlans((currentPlans) => [newPlan, ...currentPlans]);
      }

      setShowForm(false);
      setEditingPlan(null);
    } catch (error) {
      console.error("Failed to save membership plan:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to save membership plan.",
      );
    } finally {
      setSaving(false);
    }
  };

  // ---------------------------------------------------------
  // Deactivate
  // ---------------------------------------------------------

  const handleDeactivate = (plan: MembershipPlan) => {
    if (!selectedGym?.id) {
      return;
    }

    Alert.alert(
      "Deactivate plan",
      `Are you sure you want to deactivate "${plan.name}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Deactivate",
          style: "destructive",
          onPress: async () => {
            try {
              setError(null);

              await deleteMembershipPlan(selectedGym.id, plan.id);

              // Remove from active list.
              setPlans((currentPlans) =>
                currentPlans.filter((item) => item.id !== plan.id),
              );

              if (editingPlan?.id === plan.id) {
                setEditingPlan(null);
                setShowForm(false);
              }
            } catch (error) {
              console.error("Failed to deactivate plan:", error);

              setError(
                error instanceof Error
                  ? error.message
                  : "Unable to deactivate membership plan.",
              );
            }
          },
        },
      ],
    );
  };

  // ---------------------------------------------------------
  // No gym
  // ---------------------------------------------------------

  if (!selectedGym) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-2xl font-bold text-primary">
            No gym selected
          </Text>

          <Text className="mt-3 text-center text-base text-secondary">
            Please select a gym before managing membership plans.
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pb-10 pt-6"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <MembershipPlanHeader gymName={selectedGym.name} />

        {/* Error */}
        {error && (
          <View className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4">
            <Text className="text-sm leading-5 text-red-400">{error}</Text>

            <Pressable onPress={() => loadPlans()} className="mt-3 self-start">
              <Text className="font-semibold text-red-400">Try again</Text>
            </Pressable>
          </View>
        )}

        {/* Loading */}
        {loading ? (
          <View className="items-center py-16">
            <ActivityIndicator />

            <Text className="mt-3 text-sm text-secondary">
              Loading membership plans...
            </Text>
          </View>
        ) : showForm ? (
          <MembershipPlanForm
            plan={editingPlan}
            loading={saving}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingPlan(null);
            }}
          />
        ) : plans.length === 0 ? (
          <View className="mt-7">
            <MembershipPlanEmpty onCreate={handleCreate} />
          </View>
        ) : (
          <>
            <MembershipPlanList plans={plans} onPlanPress={handleEdit} />

            {/* Add button */}
            <Pressable
              onPress={handleCreate}
              className="mt-5 items-center rounded-xl bg-accent py-4"
            >
              <Text className="font-bold text-black">
                + Add Membership Plan
              </Text>
            </Pressable>
          </>
        )}

        {/* Edit mode - deactivate */}
        {showForm && editingPlan && (
          <Pressable
            onPress={() => handleDeactivate(editingPlan)}
            disabled={saving}
            className="mt-4 items-center py-3"
          >
            <Text className="font-semibold text-red-400">
              Deactivate this plan
            </Text>
          </Pressable>
        )}
      </ScrollView>
    </Screen>
  );
}
