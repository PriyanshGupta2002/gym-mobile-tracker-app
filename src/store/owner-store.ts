import { create } from "zustand";

export type OwnerGym = {
  id: string;
  name: string;
  city: string;
};

type OwnerState = {
  gyms: OwnerGym[];
  selectedGym: OwnerGym | null;

  setGyms: (gyms: OwnerGym[]) => void;
  selectGym: (gymId: string) => void;
  clearGyms: () => void;
};

export const useOwnerStore = create<OwnerState>((set, get) => ({
  gyms: [],
  selectedGym: null,

  setGyms: (gyms) => {
    const currentSelectedGym = get().selectedGym;

    // Keep the currently selected gym if it still exists.
    if (
      currentSelectedGym &&
      gyms.some((gym) => gym.id === currentSelectedGym.id)
    ) {
      set({
        gyms,
        selectedGym: currentSelectedGym,
      });

      return;
    }

    // Otherwise select the first gym.
    set({
      gyms,
      selectedGym: gyms[0] ?? null,
    });
  },

  selectGym: (gymId) => {
    const gym = get().gyms.find((item) => item.id === gymId);

    if (!gym) {
      return;
    }

    set({
      selectedGym: gym,
    });
  },

  clearGyms: () => {
    set({
      gyms: [],
      selectedGym: null,
    });
  },
}));
