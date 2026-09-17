import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";

import { Screen } from "@/components/ui/screen";

import { AttendanceDateSelector } from "@/components/owner/attendance/attendance-date-selector";
import { AttendanceHeader } from "@/components/owner/attendance/attendance-header";
import { AttendanceMemberRow } from "@/components/owner/attendance/attendance-member-row";
import { AttendanceSummaryCard } from "@/components/owner/attendance/attendance-summary-card";

import {
  getGymAttendance,
  type GymAttendanceResponse,
} from "@/services/attendance";

import { useOwnerStore } from "@/store/owner-store";

// ---------------------------------------------------------
// Get today's date in local timezone
// ---------------------------------------------------------

function getTodayString() {
  const today = new Date();

  const year = today.getFullYear();

  const month = String(today.getMonth() + 1).padStart(2, "0");

  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// ---------------------------------------------------------
// Screen
// ---------------------------------------------------------

export default function OwnerAttendanceScreen() {
  // -------------------------------------------------------
  // Selected gym
  // -------------------------------------------------------

  const selectedGym = useOwnerStore((state) => state.selectedGym);

  // -------------------------------------------------------
  // Page state
  // -------------------------------------------------------

  const [selectedDate, setSelectedDate] = useState(getTodayString());

  const [attendance, setAttendance] = useState<GymAttendanceResponse | null>(
    null,
  );

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  // -------------------------------------------------------
  // Load attendance
  // -------------------------------------------------------

  const loadAttendance = async () => {
    if (!selectedGym?.id) {
      setAttendance(null);
      return;
    }

    try {
      setError("");

      const response = await getGymAttendance(selectedGym.id, selectedDate);

      setAttendance(response);
    } catch (error) {
      console.error("Failed to load attendance:", error);

      setError(
        error instanceof Error ? error.message : "Unable to load attendance.",
      );

      setAttendance(null);
    }
  };

  // -------------------------------------------------------
  // Initial load / date change / gym change
  // -------------------------------------------------------

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      try {
        await loadAttendance();
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [selectedGym?.id, selectedDate]);

  // -------------------------------------------------------
  // Pull to refresh
  // -------------------------------------------------------

  const handleRefresh = async () => {
    try {
      setRefreshing(true);

      await loadAttendance();
    } finally {
      setRefreshing(false);
    }
  };

  // -------------------------------------------------------
  // No gym selected
  // -------------------------------------------------------

  if (!selectedGym) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-2xl font-bold text-primary">
            No gym selected
          </Text>

          <Text className="mt-2 text-center text-sm text-secondary">
            Select a gym to view its attendance.
          </Text>
        </View>
      </Screen>
    );
  }

  // -------------------------------------------------------
  // Loading
  // -------------------------------------------------------

  if (loading) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />

          <Text className="mt-4 text-sm text-secondary">
            Loading attendance...
          </Text>
        </View>
      </Screen>
    );
  }

  // -------------------------------------------------------
  // Screen
  // -------------------------------------------------------

  return (
    <Screen className="px-0">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-5 pb-10 pt-6"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* ------------------------------------------------- */}
        {/* Header */}
        {/* ------------------------------------------------- */}

        <AttendanceHeader gymName={selectedGym.name} />

        {/* ------------------------------------------------- */}
        {/* Date selector */}
        {/* ------------------------------------------------- */}

        <AttendanceDateSelector
          selectedDate={selectedDate}
          onSelect={setSelectedDate}
        />

        {/* ------------------------------------------------- */}
        {/* Error */}
        {/* ------------------------------------------------- */}

        {error ? (
          <View className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
            <Text className="text-sm text-red-400">{error}</Text>
          </View>
        ) : (
          <>
            {/* --------------------------------------------- */}
            {/* Summary */}
            {/* --------------------------------------------- */}

            <AttendanceSummaryCard total={attendance?.total_check_ins ?? 0} />

            {/* --------------------------------------------- */}
            {/* Members */}
            {/* --------------------------------------------- */}

            <View className="mt-8">
              <Text className="text-lg font-bold text-primary">Check-ins</Text>

              {attendance?.records.length === 0 ? (
                <View className="mt-4 rounded-2xl border border-border p-6">
                  <Text className="text-center text-base font-semibold text-primary">
                    No check-ins
                  </Text>

                  <Text className="mt-2 text-center text-sm text-secondary">
                    No members checked in on this date.
                  </Text>
                </View>
              ) : (
                <View className="mt-2">
                  {attendance?.records.map((record) => (
                    <AttendanceMemberRow key={record.id} attendance={record} />
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
