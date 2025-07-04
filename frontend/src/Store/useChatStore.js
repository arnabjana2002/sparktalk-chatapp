import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../Lib/axiosConfig.js";
import { useAuthStore } from "./useAuthStore.js";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSendingMessage: false,

  //* Get User Messages Sidebar functionality
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      console.log("Error in getUsers method in useChatStore:", error);
      toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  //* Get Messages functionality for a specific user
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      console.log("Error in getMessages method in useChatStore:", error);
      toast.error(error.response?.data?.message || "Failed to fetch messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  //* Send Messages functionality
  sendMessage: async (messageData) => {
    set({ isSendingMessage: true });
    const { messages, selectedUser } = get();
    try {
      const res = await axiosInstance.post(
        `messages/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to Send Message");
    } finally {
      set({ isSendingMessage: false });
    }
  },

  //! Real time functionalities -> Subscribing & Unsubscribing the Socket
  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket; // Getting socket from Auth Store
    socket.on("newMessage", (newMessage) => {
      const isTheMessageFromSelectedUser =
        newMessage.senderId !== selectedUser._id;
      if (isTheMessageFromSelectedUser) return; // Ignore messages not from the selected user
      set({ messages: [...get().messages, newMessage] });
    });
  },
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket; // Getting socket from Auth Store
    socket.off("newMessage");
  },

  //* Selecting an User for chat
  setSelectedUser: (user) => set({ selectedUser: user }),
}));
