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
  updateGym: (gym: OwnerGym) => void;
  clearGyms: () => void;
};

export const useOwnerStore = create<OwnerState>((set, get) => ({
  gyms: [],
  selectedGym: null,

  // ---------------------------------------------------------
  // Set gyms
  // ---------------------------------------------------------

  setGyms: (gyms) => {
    const currentSelectedGym = get().selectedGym;

    // Keep the same selected gym, but use the fresh object
    // from the API response.
    if (currentSelectedGym) {
      const updatedSelectedGym = gyms.find(
        (gym) => gym.id === currentSelectedGym.id,
      );

      if (updatedSelectedGym) {
        set({
          gyms,
          selectedGym: updatedSelectedGym,
        });

        return;
      }
    }

    // Otherwise select the first gym.
    set({
      gyms,
      selectedGym: gyms[0] ?? null,
    });
  },

  // ---------------------------------------------------------
  // Select gym
  // ---------------------------------------------------------

  selectGym: (gymId) => {
    const gym = get().gyms.find((item) => item.id === gymId);

    if (!gym) {
      return;
    }

    set({
      selectedGym: gym,
    });
  },

  // ---------------------------------------------------------
  // Update gym
  // ---------------------------------------------------------

  updateGym: (updatedGym) => {
    set((state) => ({
      gyms: state.gyms.map((gym) =>
        gym.id === updatedGym.id ? updatedGym : gym,
      ),

      selectedGym:
        state.selectedGym?.id === updatedGym.id
          ? updatedGym
          : state.selectedGym,
    }));
  },

  // ---------------------------------------------------------
  // Clear gyms
  // ---------------------------------------------------------

  clearGyms: () => {
    set({
      gyms: [],
      selectedGym: null,
    });
  },
}));
