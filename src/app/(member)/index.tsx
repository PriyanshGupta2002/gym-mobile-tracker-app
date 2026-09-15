import { useCallback, useEffect, useMemo, useState } from "react";

import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";

import { Card } from "@/components/ui/card";
import { Screen } from "@/components/ui/screen";
import { getMyAttendanceSummary } from "@/services/attendance";
import { CurrentUserResponse, getCurrentUser } from "@/services/auth";
import { useAttendanceStore } from "@/store/attendance-store";
import { useAuthStore } from "@/store/auth-store";

export default function MemberHomeScreen() {
  const user = useAuthStore((state) => state.user);
  const checkedInToday = useAttendanceStore((state) => state.checkedInToday);
  const setCheckedInToday = useAttendanceStore(
    (state) => state.setCheckedInToday,
  );

  const [currentUser, setCurrentUser] = useState<CurrentUserResponse | null>(
    null,
  );

  const [visitsThisWeek, setVisitsThisWeek] = useState(0);
  const [weeklyGoal, setWeeklyGoal] = useState(4);
  const [currentStreak, setCurrentStreak] = useState(0);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMemberData = useCallback(async () => {
    try {
      setError(null);

      const [me, attendance] = await Promise.all([
        getCurrentUser(),
        getMyAttendanceSummary(),
      ]);

      setCurrentUser(me);

      // Keep the backend response shape exactly as it is.
      setCheckedInToday(attendance.today.checked_in);
      setVisitsThisWeek(attendance.this_week.visits);
      setWeeklyGoal(attendance.this_week.goal);
      setCurrentStreak(attendance.streak.current);
    } catch (error) {
      console.error("Failed to load member home:", error);
      setError("Unable to load your gym data.");
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      try {
        await fetchMemberData();
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [fetchMemberData]);

  const handleRefresh = async () => {
    setRefreshing(true);

    try {
      await fetchMemberData();
    } finally {
      setRefreshing(false);
    }
  };

  const membership = currentUser?.membership;
  const gym = membership?.gym;

  const progress = useMemo(() => {
    if (weeklyGoal <= 0) {
      return 0;
    }

    return Math.min(visitsThisWeek / weeklyGoal, 1);
  }, [visitsThisWeek, weeklyGoal]);

  const remaining = Math.max(weeklyGoal - visitsThisWeek, 0);

  const formatDate = (date: string | null | undefined) => {
    if (!date) {
      return "—";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // -------------------------
  // LOADING
  // -------------------------

  if (loading) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />

          <Text className="mt-4 text-sm text-secondary">
            Loading your gym...
          </Text>
        </View>
      </Screen>
    );
  }

  // -------------------------
  // ERROR
  // -------------------------

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

  return (
    <Screen className="px-0">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-5 pb-8"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* -------------------------
            HEADER
        ------------------------- */}

        <View className="pt-5">
          <Text className="text-sm text-secondary">Good morning</Text>

          <Text className="mt-1 text-3xl font-bold text-primary">
            {currentUser?.name || user?.name || "Member"} 👋
          </Text>

          {/* Gym name shown only once */}
          {gym?.name && (
            <Text className="mt-2 text-sm text-secondary">{gym.name}</Text>
          )}
        </View>

        {/* -------------------------
            MEMBERSHIP
        ------------------------- */}

        <Card className="mt-7">
          <View className="flex-row items-center justify-between">
            <Text className="text-xs font-semibold tracking-wider text-secondary">
              MEMBERSHIP
            </Text>

            <View className="rounded-full bg-accent/15 px-3 py-1">
              <Text className="text-xs font-bold text-accent">
                ● {membership?.status || "ACTIVE"}
              </Text>
            </View>
          </View>

          <Text className="mt-5 text-2xl font-bold text-primary">
            {gym?.name || "Gym Membership"}
          </Text>

          {gym?.city && (
            <Text className="mt-1 text-sm text-secondary">{gym.city}</Text>
          )}

          <View className="mt-5 border-t border-border pt-4">
            <Text className="text-xs text-secondary">Member since</Text>

            <Text className="mt-1 text-sm font-semibold text-primary">
              {formatDate(membership?.joined_at)}
            </Text>
          </View>
        </Card>

        {/* -------------------------
            STATS
        ------------------------- */}

        <View className="mt-4 flex-row gap-4">
          {/* Streak */}

          <Card className="flex-1">
            <Text className="text-2xl">🔥</Text>

            <Text className="mt-3 text-2xl font-bold text-primary">
              {currentStreak}
            </Text>

            <Text className="mt-1 text-sm text-secondary">day streak</Text>
          </Card>

          {/* Weekly visits */}

          <Card className="flex-1">
            <Text className="text-xs font-semibold tracking-wider text-secondary">
              THIS WEEK
            </Text>

            <Text className="mt-3 text-2xl font-bold text-primary">
              {visitsThisWeek}
              <Text className="text-base text-secondary"> / {weeklyGoal}</Text>
            </Text>

            <Text className="mt-1 text-sm text-secondary">visits</Text>
          </Card>
        </View>

        {/* -------------------------
            WEEKLY GOAL
        ------------------------- */}

        <Card className="mt-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-semibold text-primary">
              Weekly goal
            </Text>

            <Text className="text-sm text-secondary">
              {Math.round(progress * 100)}%
            </Text>
          </View>

          <View className="mt-4 h-2 overflow-hidden rounded-full bg-surface-light">
            <View
              className="h-full rounded-full bg-accent"
              style={{
                width: `${progress * 100}%`,
              }}
            />
          </View>

          <Text className="mt-3 text-sm text-secondary">
            {remaining > 0
              ? `${remaining} more ${
                  remaining === 1 ? "visit" : "visits"
                } to reach your goal`
              : "Weekly goal completed 🎉"}
          </Text>
        </Card>
        {/* -------------------------
    TODAY'S ATTENDANCE
------------------------- */}
        {checkedInToday && (
          <Card className="mt-4">
            <View className="flex-row items-center">
              <View className="h-10 w-10 items-center justify-center rounded-full bg-accent/15">
                <Text className="text-lg text-accent">✓</Text>
              </View>

              <View className="ml-3 flex-1">
                <Text className="text-sm font-semibold text-primary">
                  Today's attendance
                </Text>

                <Text className="mt-1 text-xs text-secondary">
                  You've already checked in today. See you tomorrow!
                </Text>
              </View>
            </View>
          </Card>
        )}
      </ScrollView>
    </Screen>
  );
}
