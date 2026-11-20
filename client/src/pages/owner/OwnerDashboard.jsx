
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
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { toast } from "react-hot-toast";

export default function OwnerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

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
      icon: Store,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Total Ratings",
      value: totalRatings,
      icon: Users,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Average Rating",
      value: overallAverage.toFixed(1) + " / 5",
      icon: Star,
      color: "bg-yellow-100 text-yellow-600",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 md:flex">

      {/* Sidebar */}
      <aside className="flex w-full flex-col bg-slate-950 text-white md:min-h-screen md:w-64">

        <div className="border-b border-slate-800 p-6">
          <h1 className="text-xl font-bold">
            Roxiler<span className="text-blue-400">.</span>
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Rating Management System
          </p>
        </div>

        <nav className="flex-1 space-y-2 p-4">
          <div className="flex items-center gap-3 rounded-lg bg-blue-600 px-4 py-3">
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </div>
        </nav>

        <div className="border-t border-slate-800 p-5">
          <p className="truncate text-sm font-semibold">
            {user?.name}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Store Owner
          </p>

          <button
  onClick={() => navigate("/update-password")}
  className="mt-4 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-blue-400 transition hover:bg-slate-800"
>
  <KeyRound size={18} />
  Update Password
</button>

          <button
            onClick={handleLogout}
            className="mt-5 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-400 transition hover:bg-slate-800"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="min-w-0 flex-1 p-5 md:p-8">

        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Store Owner Dashboard
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Overview of your stores and customer ratings.
            </p>
          </div>

          <button
            onClick={fetchDashboard}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </header>

        {loading ? (
          <div className="rounded-xl bg-white p-10 text-center text-slate-500 shadow-sm">
            Loading dashboard...
          </div>
        ) : (
          <>
            {/* Statistics Cards */}
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {cards.map((card) => {
                const Icon = card.icon;

                return (
                  <div
                    key={card.title}
                    className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-500">
                        {card.title}
                      </p>

                      <div className={`rounded-lg p-3 ${card.color}`}>
                        <Icon size={22} />
                      </div>
                    </div>

                    <h3 className="mt-5 text-3xl font-bold text-slate-900">
                      {card.value}
                    </h3>
                  </div>
                );
              })}
            </div>

            {/* Store Details */}
            <div className="mt-8">
              <h3 className="mb-5 text-xl font-bold text-slate-900">
                My Stores
              </h3>

              {stores.length === 0 ? (
                <div className="rounded-xl bg-white p-8 text-center text-slate-500 shadow-sm">
                  No stores assigned to you yet.
                </div>
              ) : (
                <div className="grid gap-5 lg:grid-cols-2">
                  {stores.map((store) => (
                    <div
                      key={store.id}
                      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="text-lg font-bold text-slate-900">
                            {store.name}
                          </h4>
                          <p className="mt-1 text-sm text-slate-500">
                            {store.address}
                          </p>
                        </div>

                        <div className="rounded-lg bg-yellow-100 p-3 text-yellow-600">
                          <Star size={22} />
                        </div>
                      </div>

                      <div className="mt-6 grid grid-cols-2 gap-4">
                        <div className="rounded-lg bg-slate-50 p-4">
                          <p className="text-xs text-slate-500">
                            Average Rating
                          </p>
                          <p className="mt-2 text-2xl font-bold text-slate-900">
                            {Number(store.averageRating || 0).toFixed(1)}
                            <span className="ml-1 text-sm text-slate-400">
                              / 5
                            </span>
                          </p>
                        </div>

                        <div className="rounded-lg bg-slate-50 p-4">
                          <p className="text-xs text-slate-500">
                            Total Ratings
                          </p>
                          <p className="mt-2 text-2xl font-bold text-slate-900">
                            {store.totalRatings || 0}
                          </p>
                        </div>
                      </div>

                      {/* Customer Ratings */}
                      <div className="mt-6">
                        <h5 className="mb-3 font-semibold text-slate-800">
                          Customer Ratings
                        </h5>

                        {!store.ratings?.length ? (
                          <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">
                            No customer ratings yet.
                          </p>
                        ) : (
                          <div className="space-y-3">
                            {store.ratings.map((rating) => (
                              <div
                                key={rating.id}
                                className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 p-3"
                              >
                                <div>
                                  <p className="font-medium text-slate-800">
                                    {rating.user?.name || "Customer"}
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    {rating.user?.email || ""}
                                  </p>
                                </div>

                                <div className="flex items-center gap-1 font-semibold text-yellow-600">
                                  <Star size={16} fill="currentColor" />
                                  {rating.value} / 5
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
