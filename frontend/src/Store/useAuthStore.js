import { create } from "zustand";
import { axiosInstance } from "../Lib/axiosConfig.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5050" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  onlineUsers: [],
  socket: null,

  isCheckingAuth: true,

  //* Checking Authentication Status
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth method in useAuthStore:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  //* Signup functionality
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account Created Successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup Failed");
    } finally {
      set({ isSigningUp: false });
    }
  },

  //* Login functionality
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged In Successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Login Failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  //* Logout functionality
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged Out Successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Login Failed");
    }
  },

  //* Profile updating functionality
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile Updated Successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Profile Update Failed");
      console.log("Error in updateProfile method in useAuthStore:", error);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  //* Connect Socket
  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser?._id, // Sending authUser id to the socket
      },
    });
    socket.connect();
    set({ socket: socket });

    // Get Online User Map from Backend
    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  //* Disconnect Socket
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
