import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../Store/useAuthStore.js";

const ProtectedRoute = () => {
  const { authUser } = useAuthStore();

  return authUser ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
