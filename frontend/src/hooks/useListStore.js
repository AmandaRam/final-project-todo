import { create } from "zustand";

// Zustand store for user lists
const useListStore = create((set) => ({
  lists: [],
  // Set lists in store
  setLists: (lists) => set({ lists }),
  // Add list to store by taking the current state and adding the new list
  addList: (newList) => set((state) => ({ lists: [...state.lists, newList] })),
  // Edit list by taking the current state and replacing the list with the same id
  editList: (listId, editedList) =>
    set((state) => ({
      lists: [...state.lists.filter((l) => l._id !== listId), editedList],
    })),
  // Delete list by taking the current state and removing the list with the same id
  deleteList: (listId) =>
    set((state) => ({
      lists: state.lists.filter((l) => l._id !== listId),
    })),
  // Add todo to list by taking the current state and adding the new todo to the list with the same id. If the id does not match, return the list as is.
  addTodo: (listId, newTodo) =>
    set((state) => {
      const updatedLists = state.lists.map((list) => ({
        ...list,
        todos: list._id === listId ? [...list.todos, newTodo] : list.todos,
      }));

      return { lists: updatedLists };
    }),
  // Edit todo by taking the current state and replacing the todo with the same id, returning the editedTodo if the id matches. If the id does not match, return the todo as is.
  editTodo: (todoId, editedTodo) =>
    set((state) => {
      const updatedLists = state.lists.map((list) => ({
        ...list,
        todos: list.todos.map((oldTodo) =>
          oldTodo._id === todoId ? editedTodo : oldTodo,
        ),
      }));

      return { lists: updatedLists };
    }),
  // Delete the todo by filtering out all todos with the id we want to delete
  deleteTodo: (todoId) =>
    set((state) => {
      const updatedLists = state.lists.map((list) => ({
        ...list,
        todos: list.todos.filter((oldTodo) => oldTodo.todoId !== todoId),
      }));

      return { lists: updatedLists };
    }),
}));

export default useListStore;
