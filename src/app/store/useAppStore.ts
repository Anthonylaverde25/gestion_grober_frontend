import { create } from 'zustand';

interface AppState {
    count: number;
    increase: (by: number) => void;
}

/**
 * A sample Zustand store.
 */
export const useAppStore = create<AppState>((set) => ({
    count: 0,
    increase: (by) => set((state) => ({ count: state.count + by })),
}));
