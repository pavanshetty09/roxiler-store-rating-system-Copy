
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  ShieldCheck,
  Star,
  TrendingUp,
  Store,
  Mail,
  LockKeyhole,
  User,
  MapPin,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";

export default function Signup() {
  const navigate = useNavigate();
  const { signup, loading } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    if (form.name.trim().length < 20 || form.name.trim().length > 60) {
      return toast.error("Name must be between 20 and 60 characters.");
    }

    if (form.address.trim().length > 400) {
      return toast.error("Address cannot exceed 400 characters.");
    }

    if (
      form.password.length < 8 ||
      form.password.length > 16 ||
      !/[A-Z]/.test(form.password) ||
      !/[^A-Za-z0-9]/.test(form.password)
    ) {
      return toast.error(
        "Password must be 8–16 characters with an uppercase letter and a special character."
      );
    }

    try {
      const { confirmPassword, ...signupData } = form;

      await signup({
        ...signupData,
        name: form.name.trim(),
        address: form.address.trim(),
      });

      toast.success("Account created! Please sign in.");
      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Signup failed. Please try again."
      );
    }
  };

  const inputClass =
    "w-full rounded-xl border border-blue-900/80 bg-[#09172f] py-3.5 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 hover:border-blue-700 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10";

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#09152e] text-white">

      {/* Background Decorations */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-teal-500/10 blur-[110px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-blue-600/15 blur-[120px]" />

      <div className="relative z-10 grid min-h-screen lg:grid-cols-2">

        {/* LEFT BRANDING PANEL */}
        <section className="relative hidden flex-col justify-between overflow-hidden border-r border-blue-900/40 bg-[#101f40] p-10 lg:flex xl:p-16">

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

          {/* Main Branding */}
          <div className="relative z-10 max-w-xl">

            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-teal-400/20 bg-teal-400/10 px-4 py-2 text-sm text-teal-300">
              <Sparkles size={16} />
              Join the Roxiler Community
            </div>

            <h2 className="text-5xl font-bold leading-[1.15] tracking-tight xl:text-6xl">
              Your journey
              <br />
              starts here.
              <span className="mt-3 block bg-gradient-to-r from-teal-300 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                Create. Explore. Rate.
              </span>
            </h2>

            <p className="mt-7 max-w-md text-base leading-8 text-slate-400">
              Join a smarter store rating experience. Discover stores,
              share honest feedback, and help customers make better decisions.
            </p>

            {/* Feature Cards */}
            <div className="mt-12 space-y-4">

              <div className="flex items-center gap-4 rounded-2xl border border-blue-800/60 bg-[#172b50]/80 p-4">
                <div className="rounded-xl bg-blue-500/15 p-3 text-blue-400">
                  <ShieldCheck size={24} />
                </div>

                <div>
                  <p className="font-semibold text-white">
                    Secure Registration
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    Your account is protected with secure authentication.
                  </p>
                </div>

                <CheckCircle2 className="ml-auto shrink-0 text-teal-400" size={20} />
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-blue-800/60 bg-[#172b50]/80 p-4">
                <div className="rounded-xl bg-teal-500/15 p-3 text-teal-400">
                  <TrendingUp size={24} />
                </div>

                <div>
                  <p className="font-semibold text-white">
                    Meaningful Insights
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    Explore ratings and store experiences.
                  </p>
                </div>

                <CheckCircle2 className="ml-auto shrink-0 text-teal-400" size={20} />
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-blue-800/60 bg-[#172b50]/80 p-4">
                <div className="rounded-xl bg-amber-500/15 p-3 text-amber-400">
                  <Star size={24} />
                </div>

                <div>
                  <p className="font-semibold text-white">
                    Your Voice Matters
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    Share your experience through store ratings.
                  </p>
                </div>

                <CheckCircle2 className="ml-auto shrink-0 text-teal-400" size={20} />
              </div>

            </div>
          </div>

          <p className="relative z-10 text-xs text-slate-500">
            © {new Date().getFullYear()} Roxiler. All rights reserved.
          </p>
        </section>

        {/* RIGHT REGISTRATION SECTION */}
        <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:px-10">

          <div className="w-full max-w-lg">

            {/* Mobile Brand */}
            <div className="mb-9 flex items-center justify-center gap-3 lg:hidden">
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

            {/* Registration Card */}
            <div className="rounded-3xl border border-blue-900/70 bg-[#122344]/90 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">

              {/* Heading */}
              <div className="mb-7">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-teal-400/20 bg-teal-400/10 text-teal-300">
                  <User size={23} />
                </div>

                <p className="mb-3 text-xs font-bold uppercase tracking-[3px] text-teal-400">
                  Get Started
                </p>

                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Create Account<span className="text-teal-400">.</span>
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Complete your details to join the Roxiler platform.
                </p>
              </div>

              {/* Form Progress Indicator */}
              <div className="mb-7">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">
                    Registration Details
                  </span>
                  <span className="text-xs text-teal-400">
                    {[
                      form.name,
                      form.email,
                      form.address,
                      form.password,
                      form.confirmPassword,
                    ].filter((value) => value.trim()).length} / 5 completed
                  </span>
                </div>

                <div className="h-1.5 overflow-hidden rounded-full bg-blue-950">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-teal-400 to-blue-500 transition-all duration-300"
                    style={{
                      width: `${
                        ([
                          form.name,
                          form.email,
                          form.address,
                          form.password,
                          form.confirmPassword,
                        ].filter((value) => value.trim()).length / 5) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Name */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-semibold text-slate-300">
                      Full Name
                    </label>
                    <span className="text-xs text-slate-500">
                      {form.name.length}/60
                    </span>
                  </div>

                  <div className="group relative">
                    <User
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition group-focus-within:text-teal-400"
                    />

                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      minLength={20}
                      maxLength={60}
                      required
                      autoComplete="name"
                      className={inputClass}
                    />
                  </div>

                  <p className="mt-1.5 text-xs text-slate-500">
                    Name must contain 20–60 characters.
                  </p>
                </div>

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
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-semibold text-slate-300">
                      Address
                    </label>
                    <span className="text-xs text-slate-500">
                      {form.address.length}/400
                    </span>
                  </div>

                  <div className="group relative">
                    <MapPin
                      size={19}
                      className="absolute left-4 top-4 text-slate-500 transition group-focus-within:text-teal-400"
                    />

                    <textarea
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="Enter your complete address"
                      maxLength={400}
                      required
                      rows={3}
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Password
                  </label>

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
                      placeholder="Create a strong password"
                      minLength={8}
                      maxLength={16}
                      required
                      autoComplete="new-password"
                      className={`${inputClass} pr-12`}
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

                  <p className="mt-1.5 text-xs leading-5 text-slate-500">
                    8–16 characters, at least one uppercase letter and one special character.
                  </p>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Confirm Password
                  </label>

                  <div className="group relative">
                    <LockKeyhole
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition group-focus-within:text-teal-400"
                    />

                    <input
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter your password"
                      required
                      autoComplete="new-password"
                      className={`${inputClass} pr-12`}
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

                  {form.confirmPassword && (
                    <p
                      className={`mt-2 flex items-center gap-1.5 text-xs ${
                        form.password === form.confirmPassword
                          ? "text-teal-400"
                          : "text-red-400"
                      }`}
                    >
                      {form.password === form.confirmPassword ? (
                        <>
                          <CheckCircle2 size={14} />
                          Passwords match
                        </>
                      ) : (
                        "Passwords do not match"
                      )}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-teal-500 to-blue-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-teal-950/40 transition hover:-translate-y-0.5 hover:from-teal-400 hover:to-blue-500 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {loading ? "Creating account..." : "Create Your Account"}

                  {!loading && (
                    <ArrowRight
                      size={18}
                      className="transition group-hover:translate-x-1"
                    />
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="my-7 flex items-center gap-4">
                <div className="h-px flex-1 bg-blue-900" />
                <span className="text-[10px] font-semibold tracking-[2px] text-slate-500">
                  ALREADY REGISTERED?
                </span>
                <div className="h-px flex-1 bg-blue-900" />
              </div>

              <p className="text-center text-sm text-slate-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-bold text-teal-400 transition hover:text-teal-300 hover:underline"
                >
                  Sign In
                </Link>
              </p>
            </div>

            {/* Footer */}
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
              <ShieldCheck size={15} className="text-teal-500" />
              Secure registration with Roxiler
            </div>

            <p className="mt-4 text-center text-xs text-slate-600 lg:hidden">
              © {new Date().getFullYear()} Roxiler. All rights reserved.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
