import { Outlet } from "react-router";
import "./App.css";
import Navbar from "./Components/Navbar";
import { useAuthStore } from "./Store/useAuthStore.js";
import { useThemeStore } from "./Store/useThemeStore.js";
import { useEffect } from "react";

import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    // Dynamically apply theme to HTML tag
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  // console.log(authUser);

  return (
    <>
      <Navbar />
      <Outlet />

      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}

export default App;
