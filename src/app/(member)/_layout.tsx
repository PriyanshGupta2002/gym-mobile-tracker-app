import { Tabs } from "expo-router";

import { MemberTabBar } from "@/components/ui/tab-bar";

export default function MemberLayout() {
  return (
    <Tabs
      tabBar={(props) => <MemberTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />

      <Tabs.Screen
        name="attendance"
        options={{
          title: "Attendance",
        }}
      />

      <Tabs.Screen
        name="membership"
        options={{
          title: "Membership",
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />

      <Tabs.Screen
        name="check-in"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
