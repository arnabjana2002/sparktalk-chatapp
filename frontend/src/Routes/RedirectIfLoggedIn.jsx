import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../Store/useAuthStore.js";

const RedirectIfLoggedIn = () => {
  const { authUser } = useAuthStore();

  return !authUser ? <Outlet /> : <Navigate to="/" />;
};

export default RedirectIfLoggedIn;
