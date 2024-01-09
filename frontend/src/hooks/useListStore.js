import { create } from "zustand";

// Zustand store for user lists
const useListStore = create((set) => ({
  lists: [],
  setLists: (lists) => set({ lists }),
}));

export default useListStore;
