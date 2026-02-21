import { create } from "zustand";
import { User } from "@/types";

interface AppState {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    closeSidebar: () => void;

    user: User | null;
    setUser: (user: User | null) => void;
}

export const useAppStore = create<AppState>((set) => ({

    isSidebarOpen: false,
    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    closeSidebar: () => set({ isSidebarOpen: false }),

    user: null,
    setUser: (user) => set({ user }),
}));
