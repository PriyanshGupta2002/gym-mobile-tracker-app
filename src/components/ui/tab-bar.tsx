import { useAttendanceStore } from "@/store/attendance-store";
import { Ionicons } from "@expo/vector-icons";

import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toast } from "sonner-native";

const ACCENT = "#A3E635";
const BACKGROUND = "#18181B";
const BORDER = "#27272A";
const INACTIVE = "#71717A";

export function MemberTabBar({
  state,
  descriptors,
  navigation,
}: {
  state: any;
  descriptors: any;
  navigation: any;
}) {
  const insets = useSafeAreaInsets();
  const checkedInToday = useAttendanceStore((state) => state.checkedInToday);
  console.log("checkedInToday", checkedInToday);

  const visibleRoutes = state.routes.filter(
    (route) => route.name !== "check-in",
  );

  return (
    <View
      style={{
        backgroundColor: BACKGROUND,
        borderTopWidth: 1,
        borderTopColor: BORDER,
        paddingBottom: Math.max(insets.bottom, 8),
      }}
    >
      <View className="h-[64px] flex-row items-center justify-around px-3">
        {visibleRoutes.slice(0, 2).map((route) => {
          const index = state.routes.findIndex(
            (item: any) => item.key === route.key,
          );

          const focused = state.index === index;

          const { options } = descriptors[route.key];

          const label =
            typeof options.tabBarLabel === "string"
              ? options.tabBarLabel
              : (options.title ?? route.name);

          let iconName: keyof typeof Ionicons.glyphMap | undefined;

          if (route.name === "index") {
            iconName = focused ? "home" : "home-outline";
          }

          if (route.name === "attendance") {
            iconName = focused ? "calendar" : "calendar-outline";
          }

          return (
            <TabButton
              key={route.key}
              label={label}
              icon={iconName ?? "ellipse-outline"}
              focused={focused}
              onPress={() => {
                const event = navigation.emit({
                  type: "tabPress",
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!focused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              }}
            />
          );
        })}

        {/* Center Check In */}
        <Pressable
          onPress={() => {
            if (checkedInToday) {
              toast("Attendance already marked", {
                description: "You've already checked in today.",
              });
              return;
            }
            router.push("/(member)/check-in");
          }}
          className="w-[72px] items-center"
        >
          <View className="-mt-7 h-14 w-14 items-center justify-center rounded-full border-4 border-[#18181B] bg-accent">
            <Ionicons name="qr-code-outline" size={25} color="#18181B" />
          </View>

          <Text className="mt-1 text-[10px] font-bold text-accent">
            CHECK IN
          </Text>
        </Pressable>

        {visibleRoutes.slice(2).map((route) => {
          const index = state.routes.findIndex(
            (item) => item.key === route.key,
          );

          const focused = state.index === index;

          const { options } = descriptors[route.key];

          const label =
            typeof options.tabBarLabel === "string"
              ? options.tabBarLabel
              : (options.title ?? route.name);

          let iconName: keyof typeof Ionicons.glyphMap | undefined;

          if (route.name === "membership") {
            iconName = focused ? "card" : "card-outline";
          }

          if (route.name === "profile") {
            iconName = focused ? "person" : "person-outline";
          }

          return (
            <TabButton
              key={route.key}
              label={label}
              icon={iconName ?? "ellipse-outline"}
              focused={focused}
              onPress={() => {
                const event = navigation.emit({
                  type: "tabPress",
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!focused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              }}
            />
          );
        })}
      </View>
    </View>
  );
}

type TabButtonProps = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  focused: boolean;
  onPress: () => void;
};

function TabButton({ label, icon, focused, onPress }: TabButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className="w-[72px] items-center justify-center"
    >
      <View
        className={`h-8 w-12 items-center justify-center rounded-full ${
          focused ? "bg-accent/10" : ""
        }`}
      >
        <Ionicons name={icon} size={22} color={focused ? ACCENT : INACTIVE} />
      </View>

      <Text
        className={`mt-1 text-[10px] font-semibold ${
          focused ? "text-accent" : "text-secondary"
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
