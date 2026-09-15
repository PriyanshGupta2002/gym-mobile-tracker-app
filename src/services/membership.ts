import { api } from "./api";

export type JoinGymResponse = {
  message: string;
  membership: Membership;
};

export type Gym = {
  id: string;
  name: string;
  city: string;
};

export type Membership = {
  id: string;
  status: "active" | "expired" | "suspended";
  joined_at: string;
  gym: Gym;
  plan_name?: string | null;
  billing_cycle?: string | null;
  expires_at?: string | null;
};

export async function joinGym(gymId: string): Promise<JoinGymResponse> {
  const response = await api.post<JoinGymResponse>("/memberships/join", {
    gym_id: gymId,
  });

  return response.data;
}
