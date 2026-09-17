import { useEffect, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import type { MembershipPlan } from "@/services/membership-plan";

type MembershipPlanFormProps = {
  plan?: MembershipPlan | null;
  loading?: boolean;
  onSubmit: (data: {
    name: string;
    duration_days: number;
    price: number;
  }) => void;
  onCancel: () => void;
};

export function MembershipPlanForm({
  plan,
  loading = false,
  onSubmit,
  onCancel,
}: MembershipPlanFormProps) {
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");

  const [error, setError] = useState("");

  const isEditing = Boolean(plan);

  useEffect(() => {
    if (plan) {
      setName(plan.name);
      setDuration(String(plan.duration_days));
      setPrice(String(plan.price));
    } else {
      setName("");
      setDuration("");
      setPrice("");
    }

    setError("");
  }, [plan]);

  const handleSubmit = () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Please enter a plan name.");
      return;
    }

    const durationDays = Number(duration);
    const planPrice = Number(price);

    if (!duration || !Number.isInteger(durationDays) || durationDays <= 0) {
      setError("Duration must be a whole number greater than 0.");
      return;
    }

    if (!price || Number.isNaN(planPrice) || planPrice < 0) {
      setError("Please enter a valid price.");
      return;
    }

    setError("");

    onSubmit({
      name: trimmedName,
      duration_days: durationDays,
      price: planPrice,
    });
  };

  return (
    <View className="mt-6 rounded-2xl border border-border bg-surface p-5">
      <Text className="text-xl font-bold text-primary">
        {isEditing ? "Edit Membership Plan" : "Create Membership Plan"}
      </Text>

      <Text className="mt-1 text-sm text-secondary">
        {isEditing
          ? "Update the details of this plan."
          : "Add a plan that members can purchase."}
      </Text>

      {/* Name */}
      <View className="mt-6">
        <Text className="mb-2 text-sm font-semibold text-primary">
          Plan name
        </Text>

        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="e.g. Monthly"
          placeholderTextColor="#71717A"
          editable={!loading}
          className="h-14 rounded-xl border border-border bg-background px-4 text-base text-primary"
        />
      </View>

      {/* Duration */}
      <View className="mt-4">
        <Text className="mb-2 text-sm font-semibold text-primary">
          Duration
        </Text>

        <View className="flex-row items-center">
          <TextInput
            value={duration}
            onChangeText={setDuration}
            placeholder="30"
            placeholderTextColor="#71717A"
            keyboardType="number-pad"
            editable={!loading}
            className="h-14 flex-1 rounded-xl border border-border bg-background px-4 text-base text-primary"
          />

          <Text className="ml-3 text-sm text-secondary">days</Text>
        </View>
      </View>

      {/* Price */}
      <View className="mt-4">
        <Text className="mb-2 text-sm font-semibold text-primary">Price</Text>

        <View className="flex-row items-center rounded-xl border border-border bg-background">
          <Text className="pl-4 text-base font-semibold text-secondary">₹</Text>

          <TextInput
            value={price}
            onChangeText={setPrice}
            placeholder="1500"
            placeholderTextColor="#71717A"
            keyboardType="decimal-pad"
            editable={!loading}
            className="h-14 flex-1 px-3 text-base text-primary"
          />
        </View>
      </View>

      {error && <Text className="mt-4 text-sm text-red-400">{error}</Text>}

      {/* Actions */}
      <View className="mt-6 flex-row">
        <Pressable
          onPress={onCancel}
          disabled={loading}
          className="mr-3 flex-1 items-center rounded-xl border border-border py-4"
        >
          <Text className="font-bold text-primary">Cancel</Text>
        </Pressable>

        <Pressable
          onPress={handleSubmit}
          disabled={loading}
          className={`flex-1 items-center rounded-xl bg-accent py-4 ${
            loading ? "opacity-60" : ""
          }`}
        >
          <Text className="font-bold text-black">
            {loading ? "Saving..." : isEditing ? "Save Changes" : "Create Plan"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
