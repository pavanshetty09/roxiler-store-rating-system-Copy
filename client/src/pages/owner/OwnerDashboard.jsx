
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Store,
  Star,
  Users,
  LayoutDashboard,
  LogOut,
  RefreshCw,
  KeyRound,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { toast } from "react-hot-toast";

export default function OwnerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const response = await api.get("/ratings/owner/dashboard");
      const data = response.data.dashboard || response.data;

      setStores(data.stores || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to load owner dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
  };

  const totalRatings = stores.reduce(
    (total, store) => total + Number(store.totalRatings || 0),
    0
  );

  const overallAverage =
    totalRatings > 0
      ? stores.reduce(
          (total, store) =>
            total +
            Number(store.averageRating || 0) *
              Number(store.totalRatings || 0),
          0
        ) / totalRatings
      : 0;

  const cards = [
    {
      title: "My Stores",
      value: stores.length,
      description: "Stores assigned to you",
      icon: Store,
      color: "text-teal-400",
      bg: "bg-teal-500/10",
      border: "border-l-teal-500",
    },
    {
      title: "Total Ratings",
      value: totalRatings,
      description: "Customer ratings received",
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-l-blue-500",
    },
    {
      title: "Average Rating",
      value: `${overallAverage.toFixed(1)} / 5`,
      description: "Across all your stores",
      icon: Star,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-l-amber-500",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0b1736] text-slate-200 md:flex">

      {/* Mobile Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-700/60 bg-[#172554] px-4 py-3 md:hidden">
        <div>
          <h1 className="text-xl font-bold text-white">
            Roxiler<span className="text-teal-400">.</span>
          </h1>
          <p className="text-[11px] text-slate-400">
            Store Owner Portal
          </p>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg p-2 text-slate-300 hover:bg-white/10"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* Mobile Overlay */}
      {menuOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-700/60 bg-[#172554] text-white transition-transform duration-300 md:sticky md:top-0 md:h-screen md:translate-x-0 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between border-b border-slate-700/60 px-5 py-5">
          <div>
            <h1 className="text-2xl font-bold">
              Roxiler<span className="text-teal-400">.</span>
            </h1>
            <p className="mt-1 text-[10px] tracking-wider text-slate-400">
              RATING MANAGEMENT SYSTEM
            </p>
          </div>

          <button
            onClick={() => setMenuOpen(false)}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/10 md:hidden"
            aria-label="Close navigation"
          >
            <X size={19} />
          </button>
        </div>

        {/* Profile */}
        <div className="mx-3 mt-5 rounded-xl border border-slate-600/40 bg-[#1e3a5f] p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-base font-bold text-white">
              {user?.name?.charAt(0)?.toUpperCase() || "O"}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {user?.name || "Store Owner"}
              </p>
              <p className="mt-1 text-xs text-teal-300">
                Store Owner
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="px-4 pb-2 pt-7">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Main Menu
          </p>
        </div>

        <nav className="flex-1 px-3">
          <div className="flex items-center gap-3 rounded-xl bg-teal-700 px-4 py-3 text-white shadow-lg shadow-teal-950/30">
            <LayoutDashboard size={18} />
            <span className="text-sm font-medium">Dashboard</span>
          </div>
        </nav>

        {/* Account Actions */}
        <div className="border-t border-slate-700/60 p-4">
          <button
            onClick={() => {
              setMenuOpen(false);
              navigate("/update-password");
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-teal-300 transition hover:bg-teal-500/10 hover:text-white"
          >
            <KeyRound size={17} />
            Update Password
          </button>

          <button
            onClick={handleLogout}
            className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-300 transition hover:bg-red-500/10"
          >
            <LogOut size={17} />
            Logout
          </button>

          <p className="mt-3 text-center text-[10px] text-slate-500">
            Roxiler Rating System
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8">

        {/* Header */}
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-teal-400">
              Store Owner / Overview
            </p>

            <h2 className="text-xl font-bold text-white sm:text-2xl">
              Store Owner Dashboard
            </h2>

            <p className="mt-1 text-xs text-slate-400 sm:text-sm">
              Welcome back, {user?.name || "Store Owner"}. Here's your business overview.
            </p>
          </div>

          <button
            onClick={fetchDashboard}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-slate-600/70 bg-[#1e3a5f] px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-teal-500/50 hover:bg-[#26466c] disabled:opacity-50 sm:px-4 sm:text-sm"
          >
            <RefreshCw
              size={15}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </header>

        {loading ? (
          <div className="rounded-xl border border-slate-700 bg-[#1e3a5f] p-8 text-center text-sm text-slate-400">
            <RefreshCw
              size={25}
              className="mx-auto mb-3 animate-spin text-teal-400"
            />
            Loading dashboard...
          </div>
        ) : (
          <>
            {/* Statistics Cards */}
            <section className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 xl:grid-cols-3">
              {cards.map((card) => {
                const Icon = card.icon;

                return (
                  <div
                    key={card.title}
                    className={`rounded-xl border border-slate-600/40 border-l-4 ${card.border} bg-[#1e3a5f] p-4 shadow-lg transition hover:bg-[#234369] sm:p-5`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-xs font-medium text-slate-300 sm:text-sm">
                          {card.title}
                        </p>
                        <p className="mt-1 text-[10px] text-slate-500 sm:text-xs">
                          {card.description}
                        </p>
                      </div>

                      <div className={`rounded-lg p-2.5 ${card.bg} ${card.color}`}>
                        <Icon size={20} />
                      </div>
                    </div>

                    <h3 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
                      {card.value}
                    </h3>
                  </div>
                );
              })}
            </section>

            {/* Store Details */}
            <section className="mt-7">
              <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-teal-400">
                    Your Business
                  </p>
                  <h3 className="mt-1 text-lg font-bold text-white">
                    My Stores
                  </h3>
                  <p className="mt-1 text-xs text-slate-400">
                    Store performance and customer feedback.
                  </p>
                </div>

                <span className="rounded-lg border border-teal-500/20 bg-teal-500/10 px-3 py-1.5 text-xs font-medium text-teal-300">
                  {stores.length} stores
                </span>
              </div>

              {stores.length === 0 ? (
                <div className="rounded-xl border border-slate-700 bg-[#1e3a5f] p-8 text-center">
                  <Store size={34} className="mx-auto mb-3 text-slate-500" />
                  <h4 className="text-sm font-semibold text-white">
                    No stores assigned
                  </h4>
                  <p className="mt-2 text-xs text-slate-400">
                    No stores have been assigned to your account yet. Please contact the administrator.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                  {stores.map((store) => (
                    <div
                      key={store.id}
                      className="overflow-hidden rounded-xl border border-slate-600/40 bg-[#1e3a5f] shadow-lg transition hover:border-slate-500"
                    >
                      {/* Store Header */}
                      <div className="flex items-start justify-between gap-3 border-b border-slate-700/70 px-4 py-4 sm:px-5">
                        <div className="min-w-0">
                          <h4 className="break-words text-base font-bold text-white">
                            {store.name}
                          </h4>
                          <p className="mt-1 text-xs leading-relaxed text-slate-400">
                            {store.address}
                          </p>
                        </div>

                        <div className="shrink-0 rounded-lg bg-teal-500/10 p-2.5 text-teal-400">
                          <Store size={20} />
                        </div>
                      </div>

                      <div className="p-4 sm:p-5">
                        {/* Store Rating Statistics */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="rounded-lg border border-slate-700/70 bg-[#172554] p-3">
                            <div className="flex items-center gap-2 text-amber-400">
                              <Star size={15} />
                              <p className="text-[11px] text-slate-400">
                                Average Rating
                              </p>
                            </div>

                            <p className="mt-2 text-xl font-bold text-white">
                              {Number(store.averageRating || 0).toFixed(1)}
                              <span className="ml-1 text-xs font-medium text-slate-400">
                                / 5
                              </span>
                            </p>
                          </div>

                          <div className="rounded-lg border border-slate-700/70 bg-[#172554] p-3">
                            <div className="flex items-center gap-2 text-blue-400">
                              <Users size={15} />
                              <p className="text-[11px] text-slate-400">
                                Total Ratings
                              </p>
                            </div>

                            <p className="mt-2 text-xl font-bold text-white">
                              {store.totalRatings || 0}
                            </p>
                          </div>
                        </div>

                        {/* Customer Ratings */}
                        <div className="mt-5">
                          <div className="mb-3 flex items-center justify-between gap-2">
                            <h5 className="text-sm font-semibold text-white">
                              Customer Ratings
                            </h5>

                            <span className="rounded-full bg-teal-500/10 px-2.5 py-1 text-[10px] font-medium text-teal-300">
                              {store.ratings?.length || 0} customers
                            </span>
                          </div>

                          {!store.ratings?.length ? (
                            <div className="rounded-lg border border-slate-700/70 bg-[#172554] p-4 text-center">
                              <Star
                                size={22}
                                className="mx-auto mb-2 text-slate-500"
                              />
                              <p className="text-xs text-slate-400">
                                No customer ratings yet.
                              </p>
                            </div>
                          ) : (
                            <div className="max-h-52 space-y-2 overflow-y-auto pr-1">
                              {store.ratings.map((rating) => (
                                <div
                                  key={rating.id}
                                  className="flex items-center justify-between gap-2 rounded-lg border border-slate-700/70 bg-[#172554] px-3 py-2.5"
                                >
                                  <div className="flex min-w-0 items-center gap-2.5">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-700 text-xs font-bold text-white">
                                      {rating.user?.name
                                        ?.charAt(0)
                                        ?.toUpperCase() || "C"}
                                    </div>

                                    <div className="min-w-0">
                                      <p className="truncate text-xs font-medium text-white">
                                        {rating.user?.name || "Customer"}
                                      </p>
                                      <p className="truncate text-[10px] text-slate-400">
                                        {rating.user?.email || ""}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex shrink-0 items-center gap-1 rounded-md bg-amber-500/10 px-2 py-1.5 text-xs font-semibold text-amber-400">
                                    <Star size={12} fill="currentColor" />
                                    {rating.value}/5
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        {/* Footer */}
        <footer className="mt-7 border-t border-slate-700/60 pt-4 text-center text-[10px] text-slate-500 sm:text-xs">
          Roxiler Rating Management System
          <span className="mx-2 text-teal-500">•</span>
          Store Owner Dashboard
        </footer>
      </main>
    </div>
  );
}
