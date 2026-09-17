import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import RazorpayCheckout from "react-native-razorpay";
import { toast } from "sonner-native";

import { Screen } from "@/components/ui/screen";

import { getCurrentUser, type CurrentUserResponse } from "@/services/auth";

import {
  getAvailableMembershipPlans,
  type MembershipPlan,
} from "@/services/membership-plan";

import { CurrentMembershipCard } from "@/components/member/membership/current-membership-card";
import { MembershipHeader } from "@/components/member/membership/membership-header";
import { MembershipPlansList } from "@/components/member/membership/membership-plans-list";
import {
  createMembershipOrder,
  verifyMembershipPayment,
} from "@/services/payment";

export default function MemberMembershipScreen() {
  const [currentUser, setCurrentUser] = useState<CurrentUserResponse | null>(
    null,
  );

  const [plans, setPlans] = useState<MembershipPlan[]>([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const loadMembershipData = useCallback(async () => {
    try {
      setError(null);

      const me = await getCurrentUser();

      setCurrentUser(me);

      const gymId = me.membership?.gym.id;

      if (!gymId) {
        setPlans([]);
        return;
      }

      const availablePlans = await getAvailableMembershipPlans(gymId);

      setPlans(availablePlans);
    } catch (error) {
      console.error("Failed to load membership data:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load membership plans.",
      );
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      try {
        await loadMembershipData();
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [loadMembershipData]);

  const handleRefresh = async () => {
    setRefreshing(true);

    try {
      await loadMembershipData();
    } finally {
      setRefreshing(false);
    }
  };

  const handleSelectPlan = async (plan: MembershipPlan) => {
    if (!gym?.id) {
      return;
    }

    if (processingPayment) {
      return;
    }

    if (currentUser?.membership?.status === "active") {
      toast.info("Membership already exists", {
        description: "You already have an active membership.",
      });
      return;
    }

    try {
      setProcessingPayment(true);

      // ---------------------------------------------------
      // 1. Create order on our backend
      // ---------------------------------------------------

      const order = await createMembershipOrder({
        gym_id: gym.id,
        plan_id: plan.id,
      });

      // ---------------------------------------------------
      // 2. Open Razorpay Checkout
      // ---------------------------------------------------

      const razorpayResponse = await RazorpayCheckout.open({
        key: order.razorpay_key_id,
        amount: Number(order.amount) * 100,
        currency: order.currency,
        name: "Your Gym App",
        description: `${plan.name} Membership`,
        order_id: order.razorpay_order_id,

        prefill: {
          contact: currentUser?.phone ?? "",
          name: currentUser?.name ?? "",
        },

        theme: {
          color: "#000000",
        },
      });

      console.log("Razorpay success:", razorpayResponse);

      // ---------------------------------------------------
      // 3. Verify payment on our backend
      // ---------------------------------------------------

      await verifyMembershipPayment({
        payment_id: order.payment_id,
        razorpay_order_id: razorpayResponse.razorpay_order_id,
        razorpay_payment_id: razorpayResponse.razorpay_payment_id,
        razorpay_signature: razorpayResponse.razorpay_signature,
      });

      // ---------------------------------------------------
      // 4. Reload /me so UI gets ACTIVE membership
      // ---------------------------------------------------

      const updatedUser = await getCurrentUser();

      setCurrentUser(updatedUser);

      // Reload plans/membership data if required
      await loadMembershipData();
    } catch (error) {
      console.error("Membership payment failed:", error);
    } finally {
      setProcessingPayment(false);
    }
  };

  const membership = currentUser?.membership;

  const gym = membership?.gym;

  // -----------------------------------------
  // Loading
  // -----------------------------------------

  if (loading) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />

          <Text className="mt-4 text-sm text-secondary">
            Loading membership plans...
          </Text>
        </View>
      </Screen>
    );
  }

  // -----------------------------------------
  // Error
  // -----------------------------------------

  if (error) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-3xl">⚠️</Text>

          <Text className="mt-5 text-center text-2xl font-bold text-primary">
            Something went wrong
          </Text>

          <Text className="mt-3 text-center text-base text-secondary">
            {error}
          </Text>
        </View>
      </Screen>
    );
  }

  // -----------------------------------------
  // No gym
  // -----------------------------------------

  if (!gym) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-3xl">🏋️</Text>

          <Text className="mt-5 text-center text-2xl font-bold text-primary">
            No gym membership
          </Text>

          <Text className="mt-3 text-center text-base text-secondary">
            Join a gym first to view its membership plans.
          </Text>
        </View>
      </Screen>
    );
  }

  // -----------------------------------------
  // Screen
  // -----------------------------------------

  return (
    <Screen className="px-0">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-5 pb-10 pt-6"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <MembershipHeader gymName={gym.name} />

        {membership && <CurrentMembershipCard membership={membership} />}

        <MembershipPlansList plans={plans} onSelectPlan={handleSelectPlan} />
      </ScrollView>
    </Screen>
  );
}
