import { api } from "@/services/api";

export interface Gym {
  id: string;
  name: string;
  city: string;
}

export interface Attendance {
  id: string;
  checkedInAt: string;
  gym: Gym;
}

export interface CheckInResponse {
  success: boolean;
  message: string;
  attendance: Attendance;
}

export type AttendanceSummary = {
  today: {
    checked_in: boolean;
    checked_in_at: string | null;
  };
  this_week: {
    visits: number;
    goal: number;
  };
  streak: {
    current: number;
  };
};

// ---------------------------------------------------------
// Monthly Attendance History
// ---------------------------------------------------------

export type AttendanceHistoryStatus = "present" | "missed" | "upcoming";

export interface AttendanceHistoryRecord {
  id: string | null;
  date: string;
  status: AttendanceHistoryStatus;
  checked_in_at: string | null;
}

export interface AttendanceHistoryResponse {
  year: number;
  month: number;
  month_name: string;
  total_visits: number;
  records: AttendanceHistoryRecord[];
}

// ---------------------------------------------------------
// Check In
// ---------------------------------------------------------

export const checkIn = async (gymId: string): Promise<CheckInResponse> => {
  const response = await api.post<CheckInResponse>("/attendance/check-in", {
    gym_id: gymId,
  });

  return response.data;
};

// ---------------------------------------------------------
// Attendance Summary
// ---------------------------------------------------------

export async function getMyAttendanceSummary(): Promise<AttendanceSummary> {
  const response = await api.get<AttendanceSummary>("/attendance/me/summary");

  return response.data;
}

// ---------------------------------------------------------
// Attendance History
// ---------------------------------------------------------

export async function getMyAttendanceHistory(
  month: number,
  year: number,
): Promise<AttendanceHistoryResponse> {
  const response = await api.get<AttendanceHistoryResponse>("/attendance/me", {
    params: {
      month,
      year,
    },
  });

  return response.data;
}
