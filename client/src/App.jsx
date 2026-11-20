import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import { toast, Toaster } from "react-hot-toast";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminStores from "./pages/admin/AdminStores";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import UserDashboard from "./pages/user/UserDashboard";
import UpdatePassword from "./pages/auth/UpdatePassword";


function Dashboard({ role }) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <nav className="flex items-center justify-between bg-slate-950 px-6 py-4 text-white">
        <h1 className="text-xl font-bold">Roxiler Rating System</h1>

        <button
          onClick={handleLogout}
          className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium hover:bg-red-600"
        >
          Logout
        </button>
      </nav>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <p className="mb-2 text-sm font-medium uppercase tracking-wider text-blue-600">
            {role.replace("_", " ")} Dashboard
          </p>

          <h2 className="text-3xl font-bold text-slate-900">
            Welcome, {user.name}!
          </h2>

          <p className="mt-3 text-slate-500">
            Your account is authenticated successfully. We'll build your
            dashboard features next.
          </p>
        </div>
      </main>
    </div>
  );
}

function AppRoutes() {
  const { user } = useAuth();

  const getHomePath = () => {
    if (!user) return "/login";
    if (user.role === "ADMIN") return "/admin";
    if (user.role === "STORE_OWNER") return "/owner";
    return "/user";
  };

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={getHomePath()} replace />}
      />

      <Route
        path="/login"
        element={user ? <Navigate to={getHomePath()} replace /> : <Login />}
      />

      <Route
        path="/signup"
        element={user ? <Navigate to={getHomePath()} replace /> : <Signup />}
      />

      <Route
  path="/update-password"
  element={
    <ProtectedRoute allowedRoles={["USER", "STORE_OWNER"]}>
      <UpdatePassword />
    </ProtectedRoute>
  }
/>
      <Route
  path="/admin/users"
  element={
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <AdminUsers />
    </ProtectedRoute>
  }
/>

      <Route
        path="/admin"
        element={
        <ProtectedRoute allowedRoles={["ADMIN"]}>
          <AdminDashboard />
      </ProtectedRoute>
    }
/>

<Route
  path="/admin/stores"
  element={
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <AdminStores />
    </ProtectedRoute>
  }
/>

      <Route
  path="/owner"
  element={
    <ProtectedRoute allowedRoles={["STORE_OWNER"]}>
      <OwnerDashboard />
    </ProtectedRoute>
  }
/>

      <Route
  path="/user"
  element={
    <ProtectedRoute allowedRoles={["USER"]}>
      <UserDashboard />
    </ProtectedRoute>
  }
/>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}