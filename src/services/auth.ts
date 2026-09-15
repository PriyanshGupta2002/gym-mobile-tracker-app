import { api } from "./api";

export type UserRole = "member" | "owner";

export type AuthUser = {
  id: string;
  phone: string;
  role: UserRole;
  name?: string | null;
};

export type SendOtpResponse = {
  message: string;
};

export type VerifyOtpResponse = {
  access_token: string;
  refresh_token: string;
  token_type: string;
  is_new_user: boolean;
  user: AuthUser;
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
};

export type UpdateProfileResponse = {
  name: string;
};

export type CurrentUserResponse = AuthUser & {
  membership: Membership | null;
  gym: Gym[];
};
export async function sendOtp(phone: string): Promise<SendOtpResponse> {
  const response = await api.post<SendOtpResponse>("/auth/send-otp", {
    phone,
  });

  return response.data;
}

export async function verifyOtp(
  phone: string,
  otp: string,
  role: UserRole,
): Promise<VerifyOtpResponse> {
  const response = await api.post<VerifyOtpResponse>("/auth/verify-otp", {
    phone,
    otp,
    role,
  });

  return response.data;
}

export async function updateProfile(
  name: string,
): Promise<UpdateProfileResponse> {
  const response = await api.patch<UpdateProfileResponse>("/users/me", {
    name,
  });

  return response.data;
}

export async function getCurrentUser(): Promise<CurrentUserResponse> {
  const response = await api.get<CurrentUserResponse>("/users/me");

  return response.data;
}
