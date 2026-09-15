import { useCallback, useEffect, useState } from "react";

import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";

import { Card } from "@/components/ui/card";
import { Screen } from "@/components/ui/screen";

import {
  AttendanceHistoryRecord,
  getMyAttendanceHistory,
} from "@/services/attendance";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const getCurrentMonth = () => new Date().getMonth() + 1;

const getCurrentYear = () => new Date().getFullYear();

export default function AttendanceScreen() {
  const [month, setMonth] = useState(getCurrentMonth());
  const [year, setYear] = useState(getCurrentYear());

  const [records, setRecords] = useState<AttendanceHistoryRecord[]>([]);
  const [totalVisits, setTotalVisits] = useState(0);

  const [monthName, setMonthName] = useState(MONTHS[getCurrentMonth() - 1]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ---------------------------------------------------------
  // Fetch Attendance
  // ---------------------------------------------------------

  const fetchAttendance = useCallback(async () => {
    try {
      setError(null);

      const response = await getMyAttendanceHistory(month, year);

      setRecords(response.records);
      setTotalVisits(response.total_visits);
      setMonthName(response.month_name);
    } catch (error) {
      console.error("Failed to load attendance:", error);

      setError("Unable to load your attendance.");

      setRecords([]);
      setTotalVisits(0);
    }
  }, [month, year]);

  // ---------------------------------------------------------
  // Initial Load / Month Change
  // ---------------------------------------------------------

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      try {
        await fetchAttendance();
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [fetchAttendance]);

  // ---------------------------------------------------------
  // Pull To Refresh
  // ---------------------------------------------------------

  const handleRefresh = async () => {
    setRefreshing(true);

    try {
      await fetchAttendance();
    } finally {
      setRefreshing(false);
    }
  };

  // ---------------------------------------------------------
  // Month Navigation
  // ---------------------------------------------------------

  const handlePreviousMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear((currentYear) => currentYear - 1);
    } else {
      setMonth((currentMonth) => currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear((currentYear) => currentYear + 1);
    } else {
      setMonth((currentMonth) => currentMonth + 1);
    }
  };

  const now = new Date();

  const isCurrentMonth =
    month === now.getMonth() + 1 && year === now.getFullYear();

  // ---------------------------------------------------------
  // Formatters
  // ---------------------------------------------------------

  const formatDate = (dateString: string) => {
    const date = new Date(`${dateString}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // ---------------------------------------------------------
  // Loading
  // ---------------------------------------------------------

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

  // ---------------------------------------------------------
  // Error
  // ---------------------------------------------------------

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

          <Pressable
            onPress={fetchAttendance}
            className="mt-8 rounded-xl bg-accent px-8 py-4"
          >
            <Text className="font-bold text-black">Try Again</Text>
          </Pressable>
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
        contentContainerClassName="px-5 pb-10"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Header */}

        <View className="pt-5">
          <Text className="text-3xl font-bold text-primary">Attendance</Text>

          <Text className="mt-1 text-sm text-secondary">
            Keep showing up. Keep making progress.
          </Text>
        </View>

        {/* Month Selector */}

        <View className="mt-7 flex-row items-center justify-between">
          <Pressable
            onPress={handlePreviousMonth}
            className="h-10 w-10 items-center justify-center rounded-full bg-surface"
          >
            <Text className="text-xl text-primary">‹</Text>
          </Pressable>

          <View className="items-center">
            <Text className="text-lg font-bold text-primary">{monthName}</Text>

            <Text className="mt-0.5 text-sm text-secondary">{year}</Text>
          </View>

          <Pressable
            onPress={handleNextMonth}
            disabled={isCurrentMonth}
            className={`h-10 w-10 items-center justify-center rounded-full bg-surface ${
              isCurrentMonth ? "opacity-30" : ""
            }`}
          >
            <Text className="text-xl text-primary">›</Text>
          </Pressable>
        </View>

        {/* Monthly Summary */}

        <Card className="mt-5">
          <Text className="text-xs font-semibold tracking-wider text-secondary">
            {isCurrentMonth ? "THIS MONTH" : "MONTHLY SUMMARY"}
          </Text>

          <View className="mt-3 flex-row items-end">
            <Text className="text-4xl font-bold text-primary">
              {totalVisits}
            </Text>

            <Text className="mb-1 ml-2 text-sm text-secondary">
              {totalVisits === 1 ? "visit" : "visits"}
            </Text>
          </View>

          {totalVisits > 0 && (
            <Text className="mt-2 text-sm text-secondary">
              You checked in {totalVisits}{" "}
              {totalVisits === 1 ? "time" : "times"} in {monthName}.
            </Text>
          )}
        </Card>

        {/* History */}

        <View className="mt-8 flex-row items-center justify-between">
          <Text className="text-lg font-bold text-primary">
            {monthName} {year}
          </Text>

          {records.length > 0 && (
            <Text className="text-sm text-secondary">
              {totalVisits} {totalVisits === 1 ? "visit" : "visits"}
            </Text>
          )}
        </View>

        {/* Empty State */}

        {records.length === 0 ? (
          <Card className="mt-3">
            <View className="items-center py-8">
              <Text className="text-3xl">📅</Text>

              <Text className="mt-4 text-lg font-bold text-primary">
                No attendance yet
              </Text>

              <Text className="mt-2 px-5 text-center text-sm text-secondary">
                You don't have any attendance records for {monthName} {year}.
              </Text>
            </View>
          </Card>
        ) : (
          <View className="mt-3 gap-3">
            {records.map((item) => {
              const isPresent = item.status === "present";
              const isMissed = item.status === "missed";
              const isUpcoming = item.status === "upcoming";

              return (
                <Card
                  key={`${item.date}-${item.id ?? item.status}`}
                  className="p-4"
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-primary">
                        {formatDate(item.date)}
                      </Text>

                      {/* Present */}

                      {isPresent && item.checked_in_at && (
                        <Text className="mt-1 text-sm text-secondary">
                          Checked in at {formatTime(item.checked_in_at)}
                        </Text>
                      )}

                      {/* Missed */}

                      {isMissed && (
                        <Text className="mt-1 text-sm text-secondary">
                          You didn't check in on this day
                        </Text>
                      )}

                      {/* Upcoming */}

                      {isUpcoming && (
                        <Text className="mt-1 text-sm text-secondary">
                          This day hasn't happened yet
                        </Text>
                      )}
                    </View>

                    {/* Status */}

                    <View
                      className={`rounded-full px-3 py-1 ${
                        isPresent ? "bg-accent/15" : "bg-surface-light"
                      }`}
                    >
                      <Text
                        className={`text-xs font-bold ${
                          isPresent ? "text-accent" : "text-secondary"
                        }`}
                      >
                        {isPresent
                          ? "✓ PRESENT"
                          : isMissed
                            ? "MISSED"
                            : "UPCOMING"}
                      </Text>
                    </View>
                  </View>
                </Card>
              );
            })}
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}
