import { create } from "zustand";

type AttendanceState = {
  checkedInToday: boolean;
  setCheckedInToday: (checkedIn: boolean) => void;
};

export const useAttendanceStore = create<AttendanceState>((set) => ({
  checkedInToday: false,

  setCheckedInToday: (value) => {
    set({ checkedInToday: value });
  },
}));
