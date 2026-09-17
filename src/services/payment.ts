import { api } from "./api";

export type CreateMembershipOrderRequest = {
  gym_id: string;
  plan_id: string;
};

export type PaymentStatus = "CREATED" | "PAID" | "FAILED";
export type CreateMembershipOrderResponse = {
  payment_id: string;
  razorpay_order_id: string;
  razorpay_key_id: string;
  amount: string;
  currency: string;
};

export type VerifyMembershipPaymentRequest = {
  payment_id: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

export type VerifyMembershipPaymentResponse = {
  // If your backend currently returns Payment directly,
  // define the actual response fields here.
  id: string;
  status: string;
};

export type OwnerPaymentMember = {
  id: string;
  name: string | null;
  phone: string;
};

export type OwnerPaymentPlan = {
  id: string;
  name: string;
};

export type OwnerPayment = {
  id: string;
  amount: string;
  currency: string;
  status: PaymentStatus;
  razorpay_payment_id: string | null;
  paid_at: string | null;
  created_at: string;
  member: OwnerPaymentMember;
  plan: OwnerPaymentPlan;
};

export type GymPaymentsResponse = {
  gym_id: string;
  total_collected: string;
  today_collected: string;
  total_payments: number;
  payments: OwnerPayment[];
};

export async function createMembershipOrder(
  data: CreateMembershipOrderRequest,
): Promise<CreateMembershipOrderResponse> {
  const response = await api.post<CreateMembershipOrderResponse>(
    "/payments/membership/order",
    data,
  );

  return response.data;
}

export async function verifyMembershipPayment(
  data: VerifyMembershipPaymentRequest,
): Promise<VerifyMembershipPaymentResponse> {
  const response = await api.post<VerifyMembershipPaymentResponse>(
    "/payments/membership/verify",
    data,
  );

  return response.data;
}

export async function getGymPayments(
  gymId: string,
): Promise<GymPaymentsResponse> {
  const response = await api.get<GymPaymentsResponse>(
    `/payments/gyms/${gymId}`,
  );

  return response.data;
}
