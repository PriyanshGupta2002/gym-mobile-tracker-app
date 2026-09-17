import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";

type AttendanceDateSelectorProps = {
  selectedDate: string;
  onSelect: (date: string) => void;
};

// ---------------------------------------------------------
// Convert YYYY-MM-DD -> local Date
// ---------------------------------------------------------

function parseDate(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);

  return new Date(year, month - 1, day);
}

// ---------------------------------------------------------
// Convert Date -> YYYY-MM-DD
// ---------------------------------------------------------

function formatDateForApi(date: Date) {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// ---------------------------------------------------------
// Format date for display
// ---------------------------------------------------------

function formatDateForDisplay(dateString: string) {
  const date = parseDate(dateString);

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ---------------------------------------------------------
// Component
// ---------------------------------------------------------

export function AttendanceDateSelector({
  selectedDate,
  onSelect,
}: AttendanceDateSelectorProps) {
  const [showPicker, setShowPicker] = useState(false);

  // -------------------------------------------------------
  // Date changed
  // -------------------------------------------------------

  const handleDateChange = (event: any, date?: Date) => {
    setShowPicker(false);

    if (!date) {
      return;
    }

    // Extra protection against future dates
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    date.setHours(0, 0, 0, 0);

    if (date > today) {
      return;
    }

    onSelect(formatDateForApi(date));
  };

  return (
    <View className="mt-6">
      {/* Label */}

      <Text className="mb-2 text-sm font-semibold text-primary">
        Attendance date
      </Text>

      {/* Date button */}

      <Pressable
        onPress={() => setShowPicker(true)}
        className="flex-row items-center justify-between rounded-2xl border border-border bg-card px-4 py-4"
      >
        <View>
          <Text className="text-xs font-medium text-secondary">
            SELECTED DATE
          </Text>

          <Text className="mt-1 text-base font-semibold text-primary">
            {formatDateForDisplay(selectedDate)}
          </Text>
        </View>

        <Ionicons name="calendar-outline" size={22} className="text-accent" />
      </Pressable>

      {/* Native date picker */}

      {showPicker && (
        <DateTimePicker
          value={parseDate(selectedDate)}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          maximumDate={new Date()}
          onChange={handleDateChange}
        />
      )}
    </View>
  );
}
