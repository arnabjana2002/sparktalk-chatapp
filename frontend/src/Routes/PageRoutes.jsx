import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router";
import App from "../App";
import HomePage from "../Pages/HomePage";
import SignUpPage from "../Pages/SignUpPage";
import LoginPage from "../Pages/LoginPage";
import SettingsPage from "../Pages/SettingsPage";
import ProfilePage from "../Pages/ProfilePage";
import ProtectedRoute from "./ProtectedRoute";
import RedirectIfLoggedIn from "./RedirectIfLoggedIn";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route element={<RedirectIfLoggedIn />}>
        <Route path="signup" element={<SignUpPage />} />
        <Route path="login" element={<LoginPage />} />
      </Route>
      
      <Route path="settings" element={<SettingsPage />} />

      {/* Protected routes wrapper */}
      <Route element={<ProtectedRoute />}>
        <Route path="" element={<HomePage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
    </Route>
  )
);

export default router;
