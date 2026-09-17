import { Tabs } from "expo-router";

import { OwnerTabBar } from "@/components/owner/owner-tab-bar";

export default function OwnerLayout() {
  return (
    <Tabs
      tabBar={(props) => <OwnerTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Main bottom tabs */}

      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarLabel: "HOME",
        }}
      />

      <Tabs.Screen
        name="members"
        options={{
          title: "Members",
          tabBarLabel: "MEMBERS",
        }}
      />

      <Tabs.Screen
        name="red-list"
        options={{
          title: "Red List",
          tabBarLabel: "RED LIST",
        }}
      />

      <Tabs.Screen
        name="more"
        options={{
          title: "More",
          tabBarLabel: "MORE",
        }}
      />

      {/* Screens that should NOT appear as bottom tabs */}

      <Tabs.Screen
        name="attendance"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="attendance-qr"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="membership-plans"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="renewals"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="payments"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="staff"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="gym-settings"
        options={{
          href: null,
        }}
      />

      {/* QR is opened from the center action */}

      <Tabs.Screen
        name="qr"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
