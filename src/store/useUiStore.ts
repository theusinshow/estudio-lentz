import { create } from "zustand";

interface UiState {
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
  // Fix 5: stable toggle action avoids stale-closure bug
  toggleMenu: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  menuOpen: false,
  setMenuOpen: (v) => set({ menuOpen: v }),
  toggleMenu: () => set((s) => ({ menuOpen: !s.menuOpen })),
}));
