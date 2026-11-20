
import { useEffect, useState } from "react";
import {
  Users,
  Store,
  Star,
  UserCheck,
  LayoutDashboard,
  LogOut,
  RefreshCw,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);

      const response = await api.get("/admin/dashboard/stats");
      setStats(response.data.dashboard);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to load dashboard statistics"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
  };

  const closeMenu = () => setMenuOpen(false);

  const cards = [
    {
      title: "Total Users",
      value: stats?.totalUsers ?? 0,
      icon: Users,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Total Stores",
      value: stats?.totalStores ?? 0,
      icon: Store,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Store Owners",
      value: stats?.totalStoreOwners ?? 0,
      icon: UserCheck,
      color: "bg-orange-100 text-orange-600",
    },
    {
      title: "Total Ratings",
      value: stats?.totalRatings ?? 0,
      icon: Star,
      color: "bg-yellow-100 text-yellow-600",
    },
  ];

  const navigation = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: LayoutDashboard,
      active: true,
    },
    {
      name: "Manage Users",
      path: "/admin/users",
      icon: Users,
    },
    {
      name: "Manage Stores",
      path: "/admin/stores",
      icon: Store,
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-100 md:flex">

      {/* Mobile Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-slate-950 px-4 py-4 text-white md:hidden">
        <div>
          <h1 className="text-xl font-bold">
            Roxiler<span className="text-blue-400">.</span>
          </h1>
          <p className="text-xs text-slate-400">
            Admin Dashboard
          </p>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg p-2 transition hover:bg-slate-800"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={closeMenu}
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-slate-950 text-white transition-transform duration-300 md:sticky md:top-0 md:z-20 md:min-h-screen md:w-64 md:translate-x-0 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >

        {/* Logo */}
        <div className="flex items-center justify-between border-b border-slate-800 p-6">
          <div>
            <h1 className="text-xl font-bold">
              Roxiler<span className="text-blue-400">.</span>
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              Rating Management System
            </p>
          </div>

          <button
            onClick={closeMenu}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 md:hidden"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 p-4">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMenu}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                  item.active
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Admin Profile */}
        <div className="border-t border-slate-800 p-5">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">
              {user?.name}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Administrator
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="mt-5 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-400 transition hover:bg-slate-800"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">

        {/* Page Header */}
        <header className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-1 text-sm font-medium text-blue-600">
              Overview
            </p>

            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Admin Dashboard
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Overview of your store rating platform
            </p>
          </div>

          <button
            onClick={fetchStats}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </header>

        {/* Statistics Cards */}
        {loading && !stats ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm sm:p-10">
            Loading dashboard statistics...
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 xl:grid-cols-4 xl:gap-5">
              {cards.map((card) => {
                const Icon = card.icon;

                return (
                  <div
                    key={card.title}
                    className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:p-6"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-slate-500">
                        {card.title}
                      </p>

                      <div className={`shrink-0 rounded-xl p-3 ${card.color}`}>
                        <Icon size={21} />
                      </div>
                    </div>

                    <h3 className="mt-5 break-words text-3xl font-bold text-slate-900 sm:text-4xl">
                      {card.value}
                    </h3>

                    <p className="mt-2 text-xs text-slate-400">
                      Platform overview
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Average Rating */}
            <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:mt-7 sm:p-7">
              <div className="flex flex-col gap-4 min-[380px]:flex-row min-[380px]:items-center">
                <div className="w-fit rounded-2xl bg-yellow-100 p-4 text-yellow-600">
                  <Star size={28} />
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Overall Average Rating
                  </p>

                  <h3 className="mt-1 text-3xl font-bold text-slate-900 sm:text-4xl">
                    {stats?.overallAverageRating ?? 0}
                    <span className="ml-2 text-lg font-medium text-slate-400">
                      / 5
                    </span>
                  </h3>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Footer */}
        <footer className="mt-8 border-t border-slate-200 pt-5 text-center text-xs text-slate-400 sm:text-left">
          Roxiler Rating Management System
        </footer>
      </main>
    </div>
  );
}
