
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function UpdatePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();

  const getDashboardPath = () => {
    if (user?.role === "STORE_OWNER") return "/owner";
    if (user?.role === "USER") return "/user";
    return "/admin";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword.length < 8 || newPassword.length > 16) {
      toast.error("Password must be 8-16 characters");
      return;
    }

    if (!/[A-Z]/.test(newPassword) || !/[^A-Za-z0-9]/.test(newPassword)) {
      toast.error("Password needs an uppercase letter and special character");
      return;
    }

    try {
      setLoading(true);

      const response = await api.put("/auth/update-password", {
        currentPassword,
        newPassword,
      });

      toast.success(response.data.message || "Password updated successfully");

      setCurrentPassword("");
      setNewPassword("");

      navigate(getDashboardPath());
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to update password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-slate-900">
          Update Password
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Change your account password securely.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Enter current password"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Enter new password"
            />
          </div>

          <p className="text-xs text-slate-500">
            8-16 characters, including at least one uppercase letter and one
            special character.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>

          <button
            type="button"
            onClick={() => navigate(getDashboardPath())}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 font-medium text-slate-700 hover:bg-slate-50"
          >
            Back to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
