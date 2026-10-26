// store/useNavStore.ts
import { create } from 'zustand';

interface NavState {
  isOpen: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;
}

export const useNavStore = create<NavState>((set) => ({
  isOpen: false,
  toggleMenu: () => set((state) => ({ isOpen: !state.isOpen })),
  closeMenu: () => set({ isOpen: false }),
}));