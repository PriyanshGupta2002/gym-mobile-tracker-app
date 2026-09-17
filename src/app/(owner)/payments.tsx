import { useCallback, useEffect, useState } from "react";

import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";

import { Screen } from "@/components/ui/screen";

import { PaymentEmptyState } from "@/components/owner/payments/payment-empty-state";
import { PaymentHeader } from "@/components/owner/payments/payment-header";
import { PaymentRow } from "@/components/owner/payments/payment-row";
import { PaymentSummaryCard } from "@/components/owner/payments/payment-summary-card";

import { getGymPayments, type GymPaymentsResponse } from "@/services/payment";

import { useOwnerStore } from "@/store/owner-store";

export default function OwnerPaymentsScreen() {
  const selectedGym = useOwnerStore((state) => state.selectedGym);

  const [payments, setPayments] = useState<GymPaymentsResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // ---------------------------------------------------------
  // Load payments
  // ---------------------------------------------------------

  const loadPayments = useCallback(async () => {
    if (!selectedGym?.id) {
      setPayments(null);
      return;
    }

    try {
      setError("");

      const response = await getGymPayments(selectedGym.id);

      setPayments(response);
    } catch (error) {
      console.error("Failed to load gym payments:", error);

      setError(
        error instanceof Error ? error.message : "Unable to load payments.",
      );
    }
  }, [selectedGym?.id]);

  // ---------------------------------------------------------
  // Initial load
  // ---------------------------------------------------------

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      try {
        await loadPayments();
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [loadPayments]);

  // ---------------------------------------------------------
  // Pull to refresh
  // ---------------------------------------------------------

  const handleRefresh = async () => {
    try {
      setRefreshing(true);

      await loadPayments();
    } finally {
      setRefreshing(false);
    }
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

          <Text className="mt-2 text-center text-sm text-secondary">
            Select a gym to view its payments.
          </Text>
        </View>
      </Screen>
    );
  }

  // ---------------------------------------------------------
  // Loading
  // ---------------------------------------------------------

  if (loading) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />

          <Text className="mt-4 text-sm text-secondary">
            Loading payments...
          </Text>
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
        <PaymentHeader gymName={selectedGym.name} />

        {error ? (
          <View className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-5">
            <Text className="text-sm leading-5 text-red-400">{error}</Text>
          </View>
        ) : (
          <>
            <PaymentSummaryCard
              totalCollected={payments?.total_collected ?? "0"}
              todayCollected={payments?.today_collected ?? "0"}
              totalPayments={payments?.total_payments ?? 0}
            />

            <View className="mt-8">
              <View className="flex-row items-center justify-between">
                <Text className="text-lg font-bold text-primary">
                  Payment history
                </Text>

                <Text className="text-sm text-secondary">
                  {payments?.total_payments ?? 0}
                </Text>
              </View>

              {payments?.payments.length === 0 ? (
                <PaymentEmptyState />
              ) : (
                <View className="mt-3">
                  {payments?.payments.map((payment) => (
                    <PaymentRow key={payment.id} payment={payment} />
                  ))}
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </Screen>
  );
}
