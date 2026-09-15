import { GymMember } from "@/services/gym";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { MemberCard } from "./members-card";

type MembersListProps = {
  members: GymMember[];
  gymName: string;
};

export function MembersList({ members, gymName }: MembersListProps) {
  return (
    <View className="mt-6">
      <Text className="text-sm font-semibold text-primary">All members</Text>

      {members.length === 0 ? (
        <View className="mt-3">
          <Text className="text-base font-semibold text-primary">
            No members yet
          </Text>

          <Text className="mt-2 text-sm leading-5 text-secondary">
            Members who join {gymName} will appear here.
          </Text>
        </View>
      ) : (
        <View className="mt-3">
          {members.map((membership) => (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/(owner)/member/[membershipId]",
                  params: {
                    membershipId: membership.id,
                  },
                })
              }
            >
              <MemberCard key={membership.id} membership={membership} />
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}
