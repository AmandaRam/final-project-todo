import { create } from "zustand";

// Zustand store for user lists
const useListStore = create((set) => ({
  lists: [],
  setLists: (lists) => set({ lists }),
  removeTodo: (listId, todoId) => set((state) => {
    list.todos = todos;
    return { lists:[
      ...state.lists.filter((list) => list.id !== listId)] };
      state.lists[listId]
  }
}));

export default useListStore;
