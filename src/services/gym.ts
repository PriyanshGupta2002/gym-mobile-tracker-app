import { api } from "./api";

export type Gym = {
  id: string;
  name: string;
  city: string;
};

export type CreateGymRequest = {
  name: string;
  city: string;
};

export type CreateGymResponse = Gym;

// ---------------------------------------------------------
// Gym memberships
// ---------------------------------------------------------

export type GymMember = {
  id: string;
  user_id: string;
  gym_id: string;
  status: "active" | "expired" | "suspended";
  joined_at: string;
  member: {
    id: string;
    name: string | null;
    phone: string;
  };
};

export type GymMembershipsResponse = {
  gym_id: string;
  total: number;
  members: GymMember[];
  today_attendance: number;
};

export type UpdateGymRequest = {
  name: string;
  city: string;
};

export type UpdateGymResponse = Gym;

export async function createGym(
  name: string,
  city: string,
): Promise<CreateGymResponse> {
  const response = await api.post<CreateGymResponse>("/gyms", {
    name,
    city,
  });

  return response.data;
}

/**
 * Get memberships belonging to a specific gym.
 */
export async function getGymMemberships(
  gymId: string,
): Promise<GymMembershipsResponse> {
  const response = await api.get<GymMembershipsResponse>(
    `/gyms/${gymId}/members`,
  );

  return response.data;
}

export async function updateGym(
  gymId: string,
  data: UpdateGymRequest,
): Promise<UpdateGymResponse> {
  const response = await api.patch<UpdateGymResponse>(`/gyms/${gymId}`, data);

  return response.data;
}
