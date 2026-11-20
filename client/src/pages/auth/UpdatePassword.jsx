
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LockKeyhole,
  Eye,
  EyeOff,
  ShieldCheck,
  KeyRound,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Shield,
  Fingerprint,
  Sparkles,
} from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function UpdatePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();

  const getDashboardPath = () => {
    if (user?.role === "STORE_OWNER") return "/owner";
    if (user?.role === "USER") return "/user";
    return "/admin";
  };

  const hasValidLength =
    newPassword.length >= 8 && newPassword.length <= 16;

  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasSpecialCharacter = /[^A-Za-z0-9]/.test(newPassword);

  const passwordValid =
    hasValidLength && hasUppercase && hasSpecialCharacter;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword.length < 8 || newPassword.length > 16) {
      toast.error("Password must be 8-16 characters");
      return;
    }

    if (
      !/[A-Z]/.test(newPassword) ||
      !/[^A-Za-z0-9]/.test(newPassword)
    ) {
      toast.error(
        "Password needs an uppercase letter and special character"
      );
      return;
    }

    if (currentPassword === newPassword) {
      toast.error("New password must be different from current password");
      return;
    }

    try {
      setLoading(true);

      const response = await api.put("/auth/update-password", {
        currentPassword,
        newPassword,
      });

      toast.success(
        response.data.message || "Password updated successfully"
      );

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

  const Requirement = ({ valid, children }) => (
    <div className="flex items-center gap-2">
      <CheckCircle2
        size={16}
        className={valid ? "text-teal-400" : "text-slate-600"}
      />
      <span
        className={`text-xs ${
          valid ? "text-teal-300" : "text-slate-500"
        }`}
      >
        {children}
      </span>
    </div>
  );

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#09152e] px-4 py-10 text-white">

      {/* Background Decorations */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-teal-500/10 blur-[110px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-blue-600/15 blur-[120px]" />

      <div className="relative z-10 w-full max-w-5xl">

        {/* Brand Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-blue-600 shadow-lg shadow-teal-500/20">
              <KeyRound size={23} />
            </div>

            <div>
              <h1 className="text-xl font-bold">
                Roxiler<span className="text-teal-400">.</span>
              </h1>
              <p className="text-[10px] uppercase tracking-[2px] text-slate-500">
                Account Security
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate(getDashboardPath())}
            className="flex items-center gap-2 rounded-xl border border-blue-900 bg-[#172b50] px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-teal-500/50 hover:text-teal-300 sm:px-4 sm:text-sm"
          >
            <ArrowLeft size={16} />
            <span>Dashboard</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="grid overflow-hidden rounded-3xl border border-blue-900/70 bg-[#122344]/90 shadow-2xl shadow-black/30 backdrop-blur-xl lg:grid-cols-5">

          {/* Left Security Panel */}
          <section className="relative overflow-hidden border-b border-blue-900/70 bg-[#172b50] p-7 lg:col-span-2 lg:border-b-0 lg:border-r lg:p-9">

            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border border-teal-400/10" />

            <div className="relative z-10">
              <div className="mb-7 flex h-16 w-16 items-center justify-center rounded-2xl border border-teal-400/20 bg-teal-400/10 text-teal-300 shadow-lg shadow-teal-950/20">
                <ShieldCheck size={34} />
              </div>

              <p className="text-xs font-bold uppercase tracking-[3px] text-teal-400">
                Security Center
              </p>

              <h2 className="mt-4 text-3xl font-bold leading-tight text-white">
                Protect your
                <span className="block text-teal-400">
                  account.
                </span>
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-400">
                Keep your Roxiler account secure by regularly updating
                your password and using a strong combination of characters.
              </p>

              {/* Security Information */}
              <div className="mt-9 space-y-5">

                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-blue-500/15 p-2.5 text-blue-400">
                    <Fingerprint size={21} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-white">
                      Account Protection
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      Your password helps protect access to your account.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-teal-500/15 p-2.5 text-teal-400">
                    <LockKeyhole size={21} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-white">
                      Strong Passwords
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      Use uppercase letters and special characters.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-amber-500/15 p-2.5 text-amber-400">
                    <Shield size={21} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-white">
                      Secure Access
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      Never share your password with anyone.
                    </p>
                  </div>
                </div>

              </div>

              <div className="mt-10 rounded-xl border border-teal-500/20 bg-teal-500/10 p-4">
                <div className="flex items-center gap-2 text-teal-300">
                  <Sparkles size={16} />
                  <span className="text-xs font-semibold">
                    Security Tip
                  </span>
                </div>

                <p className="mt-2 text-xs leading-5 text-slate-400">
                  Avoid reusing passwords from other websites or services.
                </p>
              </div>
            </div>
          </section>

          {/* Right Password Form */}
          <section className="p-6 sm:p-9 lg:col-span-3 lg:p-12">

            <div className="mb-9">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-400">
                <KeyRound size={23} />
              </div>

              <p className="text-xs font-bold uppercase tracking-[3px] text-teal-400">
                Account Settings
              </p>

              <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
                Update Password<span className="text-teal-400">.</span>
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Enter your current password and choose a new secure password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Current Password */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Current Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    placeholder="Enter your current password"
                    className="w-full rounded-xl border border-blue-900/80 bg-[#09172f] py-3.5 pl-12 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 hover:border-blue-700 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowCurrentPassword(!showCurrentPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-teal-400"
                    aria-label={
                      showCurrentPassword
                        ? "Hide current password"
                        : "Show current password"
                    }
                  >
                    {showCurrentPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  New Password
                </label>

                <div className="relative">
                  <KeyRound
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={8}
                    maxLength={16}
                    autoComplete="new-password"
                    placeholder="Enter your new password"
                    className="w-full rounded-xl border border-blue-900/80 bg-[#09172f] py-3.5 pl-12 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 hover:border-blue-700 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-teal-400"
                    aria-label={
                      showNewPassword
                        ? "Hide new password"
                        : "Show new password"
                    }
                  >
                    {showNewPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </div>

              {/* Password Requirements */}
              <div className="rounded-xl border border-blue-900/70 bg-[#0b1933] p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Password Requirements
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Requirement valid={hasValidLength}>
                    8–16 characters
                  </Requirement>

                  <Requirement valid={hasUppercase}>
                    One uppercase letter
                  </Requirement>

                  <Requirement valid={hasSpecialCharacter}>
                    One special character
                  </Requirement>
                </div>

                {newPassword && (
                  <div className="mt-4 border-t border-blue-900/70 pt-3">
                    <p
                      className={`text-xs font-semibold ${
                        passwordValid ? "text-teal-400" : "text-amber-400"
                      }`}
                    >
                      {passwordValid
                        ? "Your password meets all requirements."
                        : "Your password does not meet all requirements yet."}
                    </p>
                  </div>
                )}
              </div>

              {/* Update Button */}
              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-teal-500 to-blue-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-teal-950/40 transition hover:-translate-y-0.5 hover:from-teal-400 hover:to-blue-500 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {loading ? "Updating Password..." : "Update Password"}

                {!loading && (
                  <ArrowRight
                    size={18}
                    className="transition group-hover:translate-x-1"
                  />
                )}
              </button>

              {/* Back Button */}
              <button
                type="button"
                onClick={() => navigate(getDashboardPath())}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-blue-900 bg-[#172b50] py-3.5 text-sm font-semibold text-slate-300 transition hover:border-teal-500/40 hover:bg-[#1e3a5f] hover:text-white"
              >
                <ArrowLeft size={17} />
                Back to Dashboard
              </button>
            </form>

            <div className="mt-8 flex items-center justify-center gap-2 border-t border-blue-900/70 pt-6 text-xs text-slate-500">
              <ShieldCheck size={15} className="text-teal-400" />
              Your account security matters.
            </div>
          </section>
        </div>

        <p className="mt-6 text-center text-xs text-slate-600">
          © {new Date().getFullYear()} Roxiler. All rights reserved.
        </p>
      </div>
    </div>
  );
}
