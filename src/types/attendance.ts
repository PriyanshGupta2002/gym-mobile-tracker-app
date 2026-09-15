export type AttendanceStatus = "checked-in" | "missed";

export type AttendanceRecord = {
  id: string;
  date: string;
  time?: string;
  status: AttendanceStatus;
};
