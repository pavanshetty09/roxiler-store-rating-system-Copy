
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Star,
  ShieldCheck,
  TrendingUp,
  Store,
  Mail,
  LockKeyhole,
  ArrowRight,
  Sparkles,
} from "lucide-react";
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
    <div className="relative min-h-screen overflow-hidden bg-[#09152e] text-white">

      {/* Background Decorations */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-teal-500/10 blur-[110px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-blue-600/15 blur-[120px]" />

      <div className="relative z-10 grid min-h-screen lg:grid-cols-2">

        {/* LEFT BRANDING PANEL */}
        <section className="relative hidden flex-col justify-between overflow-hidden border-r border-blue-900/40 bg-[#101f40] p-10 lg:flex xl:p-16">

          {/* Decorative circles */}
          <div className="pointer-events-none absolute -right-32 top-20 h-80 w-80 rounded-full border border-teal-400/10" />
          <div className="pointer-events-none absolute -right-20 top-32 h-56 w-56 rounded-full border border-blue-400/10" />

          {/* Brand */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-400 to-blue-600 shadow-lg shadow-teal-500/20">
              <Store size={25} className="text-white" />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Roxiler<span className="text-teal-400">.</span>
              </h1>
              <p className="text-[10px] uppercase tracking-[3px] text-slate-400">
                Rating Platform
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="relative z-10 max-w-xl">

            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-teal-400/20 bg-teal-400/10 px-4 py-2 text-sm text-teal-300">
              <Sparkles size={16} />
              Smarter Store Experiences
            </div>

            <h2 className="text-5xl font-bold leading-[1.15] tracking-tight xl:text-6xl">
              Every rating
              <br />
              tells a story.
              <span className="mt-3 block bg-gradient-to-r from-teal-300 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                Make yours count.
              </span>
            </h2>

            <p className="mt-7 max-w-md text-base leading-8 text-slate-400">
              Discover trusted stores, share your experiences, and
              explore meaningful customer feedback with Roxiler.
            </p>

            {/* Rating Showcase */}
            <div className="mt-12 max-w-md rounded-2xl border border-blue-800/60 bg-[#172b50]/80 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                    The power of feedback
                  </p>
                  <p className="mt-2 text-lg font-bold text-white">
                    Customer Ratings
                  </p>
                </div>

                <div className="rounded-xl bg-amber-400/10 p-3 text-amber-400">
                  <Star size={25} fill="currentColor" />
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <div className="flex gap-1 text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={22}
                      fill="currentColor"
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-slate-300">
                  Rate your experience
                </span>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-blue-500/10 p-3">
                  <ShieldCheck className="mb-2 text-blue-400" size={20} />
                  <p className="text-xs font-semibold text-white">
                    Secure
                  </p>
                  <p className="mt-1 text-[10px] text-slate-400">
                    Role-based access
                  </p>
                </div>

                <div className="rounded-xl bg-teal-500/10 p-3">
                  <TrendingUp className="mb-2 text-teal-400" size={20} />
                  <p className="text-xs font-semibold text-white">
                    Insights
                  </p>
                  <p className="mt-1 text-[10px] text-slate-400">
                    Rating analytics
                  </p>
                </div>

                <div className="rounded-xl bg-amber-500/10 p-3">
                  <Star className="mb-2 text-amber-400" size={20} />
                  <p className="text-xs font-semibold text-white">
                    Feedback
                  </p>
                  <p className="mt-1 text-[10px] text-slate-400">
                    Real experiences
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="relative z-10 text-xs text-slate-500">
            © {new Date().getFullYear()} Roxiler. All rights reserved.
          </p>
        </section>

        {/* RIGHT LOGIN SECTION */}
        <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:px-12">

          <div className="w-full max-w-md">

            {/* Mobile Brand */}
            <div className="mb-12 flex items-center justify-center gap-3 lg:hidden">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-400 to-blue-600">
                <Store size={25} />
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  Roxiler<span className="text-teal-400">.</span>
                </h1>
                <p className="text-[10px] uppercase tracking-[3px] text-slate-400">
                  Rating Platform
                </p>
              </div>
            </div>

            {/* Login Card */}
            <div className="rounded-3xl border border-blue-900/70 bg-[#122344]/90 p-7 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-9">

              {/* Heading */}
              <div className="mb-9">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-teal-400/20 bg-teal-400/10 text-teal-300">
                  <LockKeyhole size={23} />
                </div>

                <p className="mb-3 text-xs font-bold uppercase tracking-[3px] text-teal-400">
                  Welcome Back
                </p>

                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Sign in<span className="text-teal-400">.</span>
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Enter your account details to continue to your
                  Roxiler dashboard.
                </p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Email */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Email Address
                  </label>

                  <div className="group relative">
                    <Mail
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition group-focus-within:text-teal-400"
                    />

                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      required
                      autoComplete="email"
                      className="w-full rounded-xl border border-blue-900/80 bg-[#09172f] py-3.5 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 hover:border-blue-700 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="block text-sm font-semibold text-slate-300">
                      Password
                    </label>
                  </div>

                  <div className="group relative">
                    <LockKeyhole
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition group-focus-within:text-teal-400"
                    />

                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                      autoComplete="current-password"
                      className="w-full rounded-xl border border-blue-900/80 bg-[#09172f] py-3.5 pl-12 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 hover:border-blue-700 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-teal-400"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={19} />
                      ) : (
                        <Eye size={19} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-teal-500 to-blue-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-teal-950/40 transition hover:-translate-y-0.5 hover:from-teal-400 hover:to-blue-500 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {loading ? "Signing in..." : "Sign In to Dashboard"}

                  {!loading && (
                    <ArrowRight
                      size={18}
                      className="transition group-hover:translate-x-1"
                    />
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="my-8 flex items-center gap-4">
                <div className="h-px flex-1 bg-blue-900" />
                <span className="text-[10px] font-semibold tracking-[2px] text-slate-500">
                  ROXILER PLATFORM
                </span>
                <div className="h-px flex-1 bg-blue-900" />
              </div>

              {/* Signup */}
              <p className="text-center text-sm text-slate-400">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-bold text-teal-400 transition hover:text-teal-300 hover:underline"
                >
                  Create Account
                </Link>
              </p>
            </div>

            {/* Bottom Information */}
            <div className="mt-7 flex items-center justify-center gap-2 text-xs text-slate-500">
              <ShieldCheck size={15} className="text-teal-500" />
              Secure access to your Roxiler account
            </div>

            <p className="mt-5 text-center text-xs text-slate-600 lg:hidden">
              © {new Date().getFullYear()} Roxiler. All rights reserved.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
