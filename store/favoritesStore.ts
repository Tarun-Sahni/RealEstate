import { create } from 'zustand'

interface FavoritesState {
    ids: string[];
    loaded: boolean;
    setFavorites: (ids: string[]) => void;
    add: (id: string) => void;
    remove: (id: string) => void;
    reset: () => void;
}

export const useFavorites = create<FavoritesState>((set) => ({
    ids: [],
    loaded: false,
    setFavorites: (ids: string[]) => set({ ids, loaded: true }),
    add: (id: string) => set((state) => (state.ids.includes(id) ? state : { ids: [...state.ids, id] })),
    remove: (id: string) => set((state) => ({ ids: state.ids.filter((existing) => existing !== id) })),
    reset: () => set({ ids: [], loaded: false }),
}))
