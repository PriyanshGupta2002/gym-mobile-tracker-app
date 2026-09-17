import { api } from "./api";

export type MembershipPlan = {
  id: string;
  gym_id: string;
  name: string;
  duration_days: number;
  price: string;
  is_active: boolean;
  created_at: string;
};

export type CreateMembershipPlanRequest = {
  name: string;
  duration_days: number;
  price: number;
};

export type UpdateMembershipPlanRequest = {
  name?: string;
  duration_days?: number;
  price?: number;
  is_active?: boolean;
};

// ---------------------------------------------------------
// Get active membership plans
// ---------------------------------------------------------

export async function getMembershipPlans(
  gymId: string,
): Promise<MembershipPlan[]> {
  const response = await api.get<MembershipPlan[]>(
    `/membership-plans/${gymId}`,
  );

  return response.data;
}

// ---------------------------------------------------------
// Create membership plan
// ---------------------------------------------------------

export async function createMembershipPlan(
  gymId: string,
  data: CreateMembershipPlanRequest,
): Promise<MembershipPlan> {
  const response = await api.post<MembershipPlan>(
    `/membership-plans/${gymId}`,
    data,
  );

  return response.data;
}

// ---------------------------------------------------------
// Get single membership plan
// ---------------------------------------------------------

export async function getMembershipPlan(
  gymId: string,
  planId: string,
): Promise<MembershipPlan> {
  const response = await api.get<MembershipPlan>(
    `/membership-plans/${gymId}/${planId}`,
  );

  return response.data;
}

// ---------------------------------------------------------
// Update membership plan
// ---------------------------------------------------------

export async function updateMembershipPlan(
  gymId: string,
  planId: string,
  data: UpdateMembershipPlanRequest,
): Promise<MembershipPlan> {
  const response = await api.patch<MembershipPlan>(
    `/membership-plans/${gymId}/${planId}`,
    data,
  );

  return response.data;
}

// ---------------------------------------------------------
// Deactivate membership plan
// ---------------------------------------------------------

export async function deleteMembershipPlan(
  gymId: string,
  planId: string,
): Promise<MembershipPlan> {
  const response = await api.delete<MembershipPlan>(
    `/membership-plans/${gymId}/${planId}`,
  );

  return response.data;
}

export async function getAvailableMembershipPlans(
  gymId: string,
): Promise<MembershipPlan[]> {
  const response = await api.get<MembershipPlan[]>(
    `/membership-plans/${gymId}/available`,
  );

  return response.data;
}
