
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ShieldCheck, Star, TrendingUp } from "lucide-react";
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
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10";

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
            Join Our Platform
          </div>

          <h1 className="text-4xl font-bold leading-tight xl:text-5xl">
            Start your journey.
            <span className="mt-2 block text-blue-400">
              Discover smarter ratings.
            </span>
          </h1>

          <p className="mt-6 max-w-md text-base leading-7 text-slate-400">
            Create your Roxiler account and explore a smarter way
            to connect with stores, ratings, and customer experiences.
          </p>

          <div className="mt-10 space-y-5">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-white/10 p-3">
                <ShieldCheck className="text-blue-400" size={23} />
              </div>
              <div>
                <p className="font-semibold">Secure Registration</p>
                <p className="text-sm text-slate-400">
                  Your account is protected
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-white/10 p-3">
                <TrendingUp className="text-blue-400" size={23} />
              </div>
              <div>
                <p className="font-semibold">Better Experiences</p>
                <p className="text-sm text-slate-400">
                  Connect with store ratings and reviews
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="relative z-10 text-sm text-slate-500">
          © {new Date().getFullYear()} Roxiler. All rights reserved.
        </p>
      </div>

      {/* Registration Form */}
      <div className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:px-12">

        <div className="w-full max-w-md">

          {/* Mobile Logo */}
          <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-2xl font-bold text-white">
              R
            </div>
            <span className="text-2xl font-bold text-slate-900">
              Roxiler
            </span>
          </div>

          <div className="mb-7">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-600">
              Get Started
            </p>

            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Create your account
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Fill in your details below to join the Roxiler platform.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700">
                  Full Name
                </label>
                <span className="text-xs text-slate-400">
                  {form.name.length}/60
                </span>
              </div>

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

              <p className="mt-1.5 text-xs text-slate-400">
                Name must contain 20–60 characters.
              </p>
            </div>

            {/* Email */}
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
                className={inputClass}
              />
            </div>

            {/* Address */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700">
                  Address
                </label>
                <span className="text-xs text-slate-400">
                  {form.address.length}/400
                </span>
              </div>

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

            {/* Password */}
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

              <p className="mt-1.5 text-xs leading-5 text-slate-400">
                8–16 characters, at least one uppercase letter and one special character.
              </p>
            </div>


{/* Confirm Password */}
<div>
  <label className="mb-2 block text-sm font-semibold text-slate-700">
    Confirm Password
  </label>

  <div className="relative">
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

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>

          </form>

          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs text-slate-400">
              ALREADY REGISTERED?
            </span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <p className="text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-blue-600 transition hover:text-blue-700 hover:underline"
            >
              Sign In
            </Link>
          </p>

          <p className="mt-8 text-center text-xs text-slate-400 lg:hidden">
            © {new Date().getFullYear()} Roxiler. All rights reserved.
          </p>

        </div>
      </div>
    </div>
  );
}
