
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Star, ShieldCheck, TrendingUp } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = await login(form);
      toast.success("Login successful!");

      if (user.role === "ADMIN") {
        navigate("/admin");
      } else if (user.role === "STORE_OWNER") {
        navigate("/owner");
      } else {
        navigate("/user");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-2">

      {/* Left Branding Section */}
      <div className="relative hidden overflow-hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-16">

        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-2xl font-bold">
            R
          </div>
          <span className="text-2xl font-bold tracking-tight">
            Roxiler
          </span>
        </div>

        <div className="relative z-10 max-w-lg">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
            <Star size={16} />
            Smart Store Rating Platform
          </div>

          <h1 className="text-4xl font-bold leading-tight xl:text-5xl">
            Manage your stores.
            <span className="mt-2 block text-blue-400">
              Build customer trust.
            </span>
          </h1>

          <p className="mt-6 max-w-md text-base leading-7 text-slate-400">
            A smarter way to manage stores, collect customer feedback,
            and understand your business performance.
          </p>

          <div className="mt-10 space-y-5">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-white/10 p-3">
                <ShieldCheck className="text-blue-400" size={23} />
              </div>
              <div>
                <p className="font-semibold">Secure Access</p>
                <p className="text-sm text-slate-400">
                  Role-based account protection
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-white/10 p-3">
                <TrendingUp className="text-blue-400" size={23} />
              </div>
              <div>
                <p className="font-semibold">Smart Insights</p>
                <p className="text-sm text-slate-400">
                  Track ratings and store performance
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="relative z-10 text-sm text-slate-500">
          © {new Date().getFullYear()} Roxiler. All rights reserved.
        </p>
      </div>

      {/* Right Login Section */}
      <div className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:px-12">

        <div className="w-full max-w-md">

          {/* Mobile Logo */}
          <div className="mb-10 flex items-center justify-center gap-3 lg:hidden">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-2xl font-bold text-white">
              R
            </div>
            <span className="text-2xl font-bold text-slate-900">
              Roxiler
            </span>
          </div>

          <div className="mb-8">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-600">
              Welcome Back
            </p>

            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Sign in to your account
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Enter your credentials to access your Roxiler dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-blue-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs text-slate-400">ROXILER PLATFORM</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <p className="text-center text-sm text-slate-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-blue-600 transition hover:text-blue-700 hover:underline"
            >
              Create Account
            </Link>
          </p>

          <p className="mt-10 text-center text-xs text-slate-400 lg:hidden">
            © {new Date().getFullYear()} Roxiler. All rights reserved.
          </p>

        </div>
      </div>
    </div>
  );
}
