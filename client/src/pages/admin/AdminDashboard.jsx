
import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
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
  ArrowUpRight,
  Activity,
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

  const chartColors = ["#0D9488", "#3B82F6", "#A78BFA"];

  const storeChartColors = [
    "#64748B",
    "#EF4444",
    "#F97316",
    "#F59E0B",
    "#14B8A6",
  ];

  const roleData = stats?.roleDistribution ?? [];
  const ratingData = stats?.ratingDistribution ?? [];
  const storeRatingData = stats?.storeRatingDistribution ?? [];

  const averageRating = Number(stats?.overallAverageRating ?? 0);
  const safeRating = Number.isFinite(averageRating)
    ? Math.min(5, Math.max(0, averageRating))
    : 0;

  const cards = [
    {
      title: "Total Users",
      value: stats?.totalUsers ?? 0,
      icon: Users,
      description: "Registered platform users",
      iconColor: "bg-teal-500/15 text-teal-400",
      accent: "border-l-teal-500",
    },
    {
      title: "Total Stores",
      value: stats?.totalStores ?? 0,
      icon: Store,
      description: "Stores on the platform",
      iconColor: "bg-blue-500/15 text-blue-400",
      accent: "border-l-blue-500",
    },
    {
      title: "Store Owners",
      value: stats?.totalStoreOwners ?? 0,
      icon: UserCheck,
      description: "Registered store owners",
      iconColor: "bg-purple-500/15 text-purple-400",
      accent: "border-l-purple-500",
    },
    {
      title: "Total Ratings",
      value: stats?.totalRatings ?? 0,
      icon: Star,
      description: "Ratings submitted",
      iconColor: "bg-amber-500/15 text-amber-400",
      accent: "border-l-amber-500",
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

  const tooltipStyle = {
    backgroundColor: "#172554",
    border: "1px solid #475569",
    borderRadius: "10px",
    color: "#fff",
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0b1736] text-slate-200 md:flex">

      {/* Mobile Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-700/60 bg-[#172554] px-4 py-3 md:hidden">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Roxiler<span className="text-teal-400">.</span>
          </h1>
          <p className="text-[11px] text-slate-400">Management Portal</p>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg p-2 text-slate-300 transition hover:bg-white/10"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </header>

      {/* Mobile Overlay */}
      {menuOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={closeMenu}
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-700/60 bg-[#172554] text-white transition-transform duration-300 md:sticky md:top-0 md:z-20 md:min-h-screen md:translate-x-0 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between border-b border-slate-700/60 px-5 py-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Roxiler<span className="text-teal-400">.</span>
            </h1>
            <p className="mt-1 text-[10px] tracking-wide text-slate-400">
              CRM MANAGEMENT SYSTEM
            </p>
          </div>

          <button
            onClick={closeMenu}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/10 md:hidden"
            aria-label="Close menu"
          >
            <X size={19} />
          </button>
        </div>

        {/* Admin Profile */}
        <div className="mx-4 mt-5 rounded-xl border border-slate-600/40 bg-[#1e3a5f] p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-600 text-base font-bold text-white">
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {user?.name || "Administrator"}
              </p>
              <p className="mt-1 text-[11px] text-teal-300">
                System Administrator
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="px-5 pb-2 pt-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
            Main Menu
          </p>
        </div>

        <nav className="flex-1 space-y-1.5 px-4">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMenu}
                className={`group flex items-center gap-3 rounded-lg px-3.5 py-3 transition-all duration-200 ${
                  item.active
                    ? "bg-teal-700 text-white shadow-lg shadow-teal-950/30"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={18} />
                <span className="flex-1 text-sm font-medium">
                  {item.name}
                </span>

                {item.active && (
                  <span className="h-2 w-2 rounded-full bg-teal-300" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Bottom */}
        <div className="border-t border-slate-700/60 p-4">
          <div className="mb-3 flex items-center gap-2 text-[11px] text-slate-400">
            <Activity size={14} className="text-teal-400" />
            <span>Platform Management</span>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium text-red-300 transition hover:bg-red-500/10 hover:text-red-200"
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="min-w-0 flex-1 px-3 py-4 sm:px-5 lg:px-7 lg:py-5">

        {/* Top Header */}
        <header className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <div className="mb-1.5 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-teal-400" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-teal-400">
                Overview
              </p>
            </div>

            <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              Admin Dashboard
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Welcome back, {user?.name || "Administrator"}. Here's your platform overview.
            </p>
          </div>

          <button
            onClick={fetchStats}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-600/70 bg-[#1e3a5f] px-4 py-2.5 text-xs font-semibold text-slate-200 shadow-sm transition hover:border-teal-500/50 hover:bg-[#26466c] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            <RefreshCw
              size={15}
              className={loading ? "animate-spin" : ""}
            />
            Refresh Data
          </button>
        </header>

        {/* Statistics Heading */}
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-white">
              Platform Statistics
            </h3>
            <p className="mt-0.5 text-[11px] text-slate-400">
              Key metrics at a glance
            </p>
          </div>

          <span className="rounded-md border border-teal-500/20 bg-teal-500/10 px-2.5 py-1 text-[10px] font-medium text-teal-300">
            Live Overview
          </span>
        </div>

        {/* Statistics Cards */}
        {loading && !stats ? (
          <div className="rounded-xl border border-slate-700 bg-[#1e3a5f] p-8 text-center text-sm text-slate-400">
            <RefreshCw
              className="mx-auto mb-3 animate-spin text-teal-400"
              size={23}
            />
            Loading dashboard statistics...
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 xl:grid-cols-4">
              {cards.map((card) => {
                const Icon = card.icon;

                return (
                  <div
                    key={card.title}
                    className={`group min-w-0 rounded-xl border border-slate-600/40 border-l-4 ${card.accent} bg-[#1e3a5f] p-4 shadow-lg shadow-black/10 transition duration-200 hover:-translate-y-1 hover:border-slate-500 hover:bg-[#234369]`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-medium text-slate-300">
                        {card.title}
                      </p>

                      <div className={`shrink-0 rounded-lg p-2 ${card.iconColor}`}>
                        <Icon size={18} />
                      </div>
                    </div>

                    <h3 className="mt-3 break-words text-2xl font-bold tracking-tight text-white sm:text-3xl">
                      {card.value}
                    </h3>

                    <div className="mt-2 flex items-center gap-1.5">
                      <ArrowUpRight size={12} className="text-teal-400" />
                      <p className="text-[10px] text-slate-400">
                        {card.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Rating Performance */}
            <section className="mt-5">
              <div className="mb-3">
                <h3 className="text-base font-semibold text-white">
                  Rating Performance
                </h3>
                <p className="mt-0.5 text-[11px] text-slate-400">
                  Overall customer rating across all stores
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">

                {/* Average Rating Card */}
                <div className="rounded-xl border border-slate-600/40 bg-[#1e3a5f] p-4 shadow-lg shadow-black/10 lg:col-span-2 sm:p-5">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="rounded-lg bg-amber-500/15 p-2.5 text-amber-400">
                          <Star size={19} />
                        </div>
                        <p className="text-xs font-medium text-slate-300">
                          Overall Average Rating
                        </p>
                      </div>

                      <div className="mt-4 flex items-baseline gap-2">
                        <h3 className="text-4xl font-bold tracking-tight text-white">
                          {safeRating.toFixed(1)}
                        </h3>
                        <span className="text-base text-slate-400">/ 5.0</span>
                      </div>

                      <div className="mt-2 flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={16}
                            className={
                              star <= Math.round(safeRating)
                                ? "fill-amber-400 text-amber-400"
                                : "text-slate-600"
                            }
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex h-24 w-24 shrink-0 items-center justify-center self-center rounded-full border-[6px] border-slate-600 sm:h-28 sm:w-28">
                      <div className="flex flex-col items-center">
                        <span className="text-2xl font-bold text-teal-300">
                          {Math.round((safeRating / 5) * 100)}%
                        </span>
                        <span className="mt-0.5 text-[9px] uppercase tracking-wider text-slate-400">
                          Rating Score
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="mb-1.5 flex justify-between text-[10px]">
                      <span className="text-slate-400">
                        Rating performance
                      </span>
                      <span className="font-semibold text-teal-300">
                        {safeRating.toFixed(1)} out of 5
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-700">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-teal-700 to-teal-400 transition-all duration-700"
                        style={{ width: `${(safeRating / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Customer Feedback */}
                <div className="flex flex-col justify-between rounded-xl border border-slate-600/40 bg-[#1e3a5f] p-4 shadow-lg shadow-black/10 sm:p-5">
                  <div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400">
                      <Star size={19} />
                    </div>

                    <p className="mt-4 text-xs font-medium text-slate-400">
                      Customer Feedback
                    </p>

                    <h3 className="mt-1.5 text-3xl font-bold text-white">
                      {stats?.totalRatings ?? 0}
                    </h3>

                    <p className="mt-1.5 text-[11px] text-slate-400">
                      Total ratings received across the platform
                    </p>
                  </div>

                  <div className="mt-4 border-t border-slate-600/60 pt-3">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Platform status</span>
                      <span className="flex items-center gap-1.5 font-medium text-teal-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Platform Analytics */}
            <section className="mt-5">
              <div className="mb-3">
                <h3 className="text-base font-semibold text-white">
                  Platform Analytics
                </h3>
                <p className="mt-0.5 text-[11px] text-slate-400">
                  Visual insights into users, ratings and store performance
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">

                {/* User Role Distribution */}
                <div className="rounded-xl border border-slate-600/40 bg-[#1e3a5f] p-4 shadow-lg shadow-black/10">
                  <h4 className="text-sm font-semibold text-white">
                    User Role Distribution
                  </h4>
                  <p className="mt-0.5 text-[10px] text-slate-400">
                    Breakdown of registered platform users
                  </p>

                  {roleData.reduce((sum, item) => sum + item.value, 0) === 0 ? (
                    <div className="flex h-[220px] items-center justify-center text-xs text-slate-400">
                      No user data available
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie
                          data={roleData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="48%"
                          outerRadius={75}
                          innerRadius={45}
                          paddingAngle={4}
                          stroke="none"
                        >
                          {roleData.map((entry, index) => (
                            <Cell
                              key={entry.name}
                              fill={chartColors[index % chartColors.length]}
                            />
                          ))}
                        </Pie>

                        <Tooltip
                          contentStyle={tooltipStyle}
                          itemStyle={{ color: "#fff" }}
                        />

                        <Legend
                          verticalAlign="bottom"
                          formatter={(value) => (
                            <span className="text-[10px] text-slate-300">
                              {value}
                            </span>
                          )}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>

                {/* Rating Distribution */}
                <div className="rounded-xl border border-slate-600/40 bg-[#1e3a5f] p-4 shadow-lg shadow-black/10">
                  <h4 className="text-sm font-semibold text-white">
                    Rating Distribution
                  </h4>
                  <p className="mt-0.5 text-[10px] text-slate-400">
                    Number of ratings received for each star level
                  </p>

                  {ratingData.length === 0 ? (
                    <div className="flex h-[220px] items-center justify-center text-xs text-slate-400">
                      No rating data available
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart
                        data={ratingData}
                        margin={{ top: 15, right: 5, left: -20, bottom: 5 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#475569"
                          vertical={false}
                        />

                        <XAxis
                          dataKey="name"
                          tick={{ fill: "#CBD5E1", fontSize: 10 }}
                          axisLine={{ stroke: "#64748B" }}
                          tickLine={false}
                        />

                        <YAxis
                          allowDecimals={false}
                          tick={{ fill: "#CBD5E1", fontSize: 10 }}
                          axisLine={false}
                          tickLine={false}
                        />

                        <Tooltip
                          contentStyle={tooltipStyle}
                          itemStyle={{ color: "#fff" }}
                        />

                        <Bar
                          dataKey="count"
                          name="Total Ratings"
                          fill="#14B8A6"
                          radius={[6, 6, 0, 0]}
                          maxBarSize={40}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>

                {/* Store Rating Overview */}
                <div className="rounded-xl border border-slate-600/40 bg-[#1e3a5f] p-4 shadow-lg shadow-black/10 xl:col-span-2">
                  <h4 className="text-sm font-semibold text-white">
                    Store Rating Overview
                  </h4>
                  <p className="mt-0.5 text-[10px] text-slate-400">
                    Stores grouped by their average customer rating
                  </p>

                  {storeRatingData.reduce(
                    (sum, item) => sum + item.value,
                    0
                  ) === 0 ? (
                    <div className="flex h-[220px] items-center justify-center text-xs text-slate-400">
                      No store data available
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 items-center gap-3 md:grid-cols-2">
                      <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                          <Pie
                            data={storeRatingData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={85}
                            paddingAngle={3}
                            stroke="none"
                          >
                            {storeRatingData.map((entry, index) => (
                              <Cell
                                key={entry.name}
                                fill={
                                  storeChartColors[
                                    index % storeChartColors.length
                                  ]
                                }
                              />
                            ))}
                          </Pie>

                          <Tooltip
                            contentStyle={tooltipStyle}
                            itemStyle={{ color: "#fff" }}
                          />
                        </PieChart>
                      </ResponsiveContainer>

                      <div className="space-y-3 px-2">
                        {storeRatingData.map((item, index) => (
                          <div
                            key={item.name}
                            className="flex items-center justify-between gap-3"
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className="h-2.5 w-2.5 shrink-0 rounded-full"
                                style={{
                                  backgroundColor:
                                    storeChartColors[
                                      index % storeChartColors.length
                                    ],
                                }}
                              />
                              <span className="text-xs text-slate-300">
                                {item.name}
                              </span>
                            </div>

                            <span className="text-xs font-semibold text-white">
                              {item.value} stores
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </>
        )}

        {/* Footer */}
        <footer className="mt-6 flex flex-col justify-between gap-1.5 border-t border-slate-700/60 pt-4 text-[10px] text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Roxiler CRM. All rights reserved.</p>
          <p>Store Rating Management Platform</p>
        </footer>
      </main>
    </div>
  );
}
