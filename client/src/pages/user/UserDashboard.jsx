
import { useEffect, useState } from "react";
import {
  Store,
  Star,
  LayoutDashboard,
  LogOut,
  Search,
  RefreshCw,
  KeyRound,
  Menu,
  X,
  MapPin,
  Mail,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import toast from "react-hot-toast";

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState({});
  const [submitting, setSubmitting] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchStores = async () => {
    try {
      setLoading(true);

      const response = await api.get("/stores", {
        params: { search, page, limit: 10, sortBy, order },
      });

      const data = response.data;
      const storeList = data.stores || [];

      setStores(storeList);
      setTotalPages(data.totalPages || 1);

      const ratingValues = {};

      storeList.forEach((store) => {
        ratingValues[store.id] =
          store.userRating?.value || store.userRating || 0;
      });

      setRatings(ratingValues);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to load stores"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [search, page, sortBy, order]);

  const submitRating = async (storeId) => {
    const value = Number(ratings[storeId]);

    if (!value || value < 1 || value > 5) {
      toast.error("Please select a rating between 1 and 5");
      return;
    }

    try {
      setSubmitting(storeId);

      await api.post("/ratings", {
        storeId,
        value,
      });

      toast.success("Rating submitted successfully");
      await fetchStores();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to submit rating"
      );
    } finally {
      setSubmitting(null);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
  };

  const averageRating = (store) =>
    Number(store.averageRating || 0).toFixed(1);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0b1736] text-slate-200 md:flex">

      {/* Mobile Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-700/60 bg-[#172554] px-4 py-3 md:hidden">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Roxiler<span className="text-teal-400">.</span>
          </h1>
          <p className="text-[11px] text-slate-400">
            Customer Portal
          </p>
        </div>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="rounded-lg p-2 text-slate-300 transition hover:bg-white/10"
          aria-label={sidebarOpen ? "Close menu" : "Open menu"}
          aria-expanded={sidebarOpen}
        >
          {sidebarOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </header>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-700/60 bg-[#172554] text-white transition-transform duration-300 md:sticky md:top-0 md:h-screen md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between border-b border-slate-700/60 px-5 py-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Roxiler<span className="text-teal-400">.</span>
            </h1>
            <p className="mt-1 text-[10px] tracking-wide text-slate-400">
              RATING MANAGEMENT SYSTEM
            </p>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/10 md:hidden"
            aria-label="Close menu"
          >
            <X size={19} />
          </button>
        </div>

        {/* Navigation */}
        <div className="px-5 pb-2 pt-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
            Main Menu
          </p>
        </div>

        <nav className="flex-1 space-y-2 px-4">
          <div className="flex items-center gap-3 rounded-lg border border-teal-400/20 bg-teal-700 px-3.5 py-3 text-white shadow-lg shadow-teal-950/20">
            <LayoutDashboard size={18} />
            <span className="text-sm font-semibold">Dashboard</span>
          </div>

          <div className="mt-4 rounded-xl border border-slate-600/40 bg-[#1e3a5f] p-3.5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Your Activity
            </p>

            <div className="mt-3 flex items-center gap-3">
              <div className="rounded-lg bg-amber-500/15 p-2 text-amber-400">
                <Star size={17} />
              </div>
              <div>
                <p className="text-xs font-medium text-white">
                  Rate a Store
                </p>
                <p className="mt-0.5 text-[10px] text-slate-400">
                  Share your experience
                </p>
              </div>
            </div>
          </div>
        </nav>

        {/* Profile and Actions */}
        <div className="border-t border-slate-700/60 p-4">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-600 text-base font-bold text-white">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-white">
                {user?.name || "User"}
              </p>
              <p className="mt-0.5 text-[10px] text-slate-400">
                Normal User
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/update-password")}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs text-blue-300 transition hover:bg-blue-900/60 hover:text-white"
          >
            <KeyRound size={16} />
            Update Password
          </button>

          <button
            onClick={handleLogout}
            className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs text-red-300 transition hover:bg-red-500/10 hover:text-red-200"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="min-w-0 flex-1 px-3 py-4 sm:px-5 lg:px-7 lg:py-5">

        {/* Header */}
        <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-teal-400">
              Customer Portal
            </p>

            <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              User Dashboard
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Discover stores and share your ratings.
            </p>
          </div>

          <button
            onClick={fetchStores}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-slate-600/70 bg-[#1e3a5f] px-3.5 py-2 text-xs font-semibold text-slate-200 transition hover:border-teal-500/50 hover:bg-[#26466c] disabled:opacity-50"
          >
            <RefreshCw
              size={14}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </header>

        {/* Welcome Banner */}
        <section className="relative mb-5 overflow-hidden rounded-xl border border-blue-800/60 bg-gradient-to-r from-[#1e3a5f] via-[#1d3560] to-[#134e4a] p-4 shadow-lg sm:p-5">
          <div className="relative z-10">
            <p className="text-xs font-medium text-teal-300">
              Welcome back!
            </p>

            <h3 className="mt-1.5 text-lg font-bold text-white sm:text-xl">
              Hello, {user?.name || "User"}!
            </h3>

            <p className="mt-1.5 max-w-xl text-xs leading-5 text-slate-300">
              Explore stores, compare customer ratings, and share your
              experience by giving your own rating.
            </p>
          </div>

          <div className="pointer-events-none absolute -right-3 -top-8 opacity-[0.08]">
            <Star size={135} fill="currentColor" />
          </div>
        </section>

        {/* Summary Cards */}
        <section className="mb-5 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-xl border border-slate-600/40 bg-[#1e3a5f] p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">
                  Available Stores
                </p>
                <h3 className="mt-1.5 text-2xl font-bold text-white">
                  {loading ? "..." : stores.length}
                </h3>
              </div>

              <div className="rounded-lg bg-blue-500/15 p-2.5 text-blue-400">
                <Store size={20} />
              </div>
            </div>

            <p className="mt-2 text-[10px] text-slate-500">
              Stores displayed on this page
            </p>
          </div>

          <div className="rounded-xl border border-slate-600/40 bg-[#1e3a5f] p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">
                  Stores With Ratings
                </p>

                <h3 className="mt-1.5 text-2xl font-bold text-white">
                  {loading
                    ? "..."
                    : stores.filter(
                        (store) =>
                          Number(store.averageRating || 0) > 0
                      ).length}
                </h3>
              </div>

              <div className="rounded-lg bg-amber-500/15 p-2.5 text-amber-400">
                <Star size={20} />
              </div>
            </div>

            <p className="mt-2 text-[10px] text-slate-500">
              Stores with customer feedback on this page
            </p>
          </div>

          <div className="rounded-xl border border-slate-600/40 bg-[#1e3a5f] p-4 shadow-lg min-[420px]:col-span-2 xl:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">
                  Current Page
                </p>

                <h3 className="mt-1.5 text-2xl font-bold text-white">
                  {page} / {totalPages}
                </h3>
              </div>

              <div className="rounded-lg bg-teal-500/15 p-2.5 text-teal-400">
                <LayoutDashboard size={20} />
              </div>
            </div>

            <p className="mt-2 text-[10px] text-slate-500">
              Browse available stores
            </p>
          </div>
        </section>

        {/* Search and Sorting */}
        <section className="mb-5 rounded-xl border border-slate-600/40 bg-[#172b50] p-4 shadow-lg">
          <div className="mb-3 flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-teal-400" />
            <h3 className="text-sm font-semibold text-white">
              Find Your Store
            </h3>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div className="relative">
              <Search
                className="absolute left-3 top-2.5 text-slate-400"
                size={16}
              />

              <input
                type="text"
                placeholder="Search stores by name or address..."
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                className="w-full rounded-lg border border-blue-900 bg-[#0b1736] py-2.5 pl-9 pr-3 text-xs text-white outline-none placeholder:text-slate-500 transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10"
              />
            </div>

            <select
              value={sortBy}
              onChange={(event) => {
                setSortBy(event.target.value);
                setPage(1);
              }}
              className="rounded-lg border border-blue-900 bg-[#0b1736] px-3 py-2.5 text-xs text-slate-200 outline-none focus:border-teal-500"
            >
              <option value="name">Sort by Store Name</option>
              <option value="email">Sort by Email</option>
              <option value="address">Sort by Address</option>
              <option value="createdAt">Sort by Date Added</option>
            </select>

            <select
              value={order}
              onChange={(event) => {
                setOrder(event.target.value);
                setPage(1);
              }}
              className="rounded-lg border border-blue-900 bg-[#0b1736] px-3 py-2.5 text-xs text-slate-200 outline-none focus:border-teal-500"
            >
              <option value="asc">Ascending (A–Z)</option>
              <option value="desc">Descending (Z–A)</option>
            </select>
          </div>
        </section>

        {/* Store List Heading */}
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white">
              Explore Stores
            </h3>
            <p className="mt-0.5 text-[11px] text-slate-400">
              Select a store and share your experience.
            </p>
          </div>

          <span className="rounded-full border border-teal-500/30 bg-teal-500/10 px-2.5 py-1 text-[10px] font-semibold text-teal-300">
            {stores.length} stores on this page
          </span>
        </div>

        {/* Store List */}
        {loading ? (
          <div className="rounded-xl border border-slate-600/40 bg-[#1e3a5f] p-9 text-center">
            <RefreshCw
              size={25}
              className="mx-auto animate-spin text-teal-400"
            />
            <p className="mt-3 text-xs text-slate-400">
              Loading stores...
            </p>
          </div>
        ) : stores.length === 0 ? (
          <div className="rounded-xl border border-slate-600/40 bg-[#1e3a5f] p-9 text-center">
            <Store size={32} className="mx-auto text-slate-500" />

            <h3 className="mt-3 text-sm font-semibold text-white">
              No stores found
            </h3>

            <p className="mt-1.5 text-xs text-slate-400">
              Try changing your search or sorting options.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {stores.map((store) => (
              <div
                key={store.id}
                className="group overflow-hidden rounded-xl border border-slate-600/40 bg-[#1e3a5f] shadow-lg transition duration-200 hover:-translate-y-0.5 hover:border-teal-500/50 hover:shadow-xl hover:shadow-teal-950/20"
              >
                {/* Store Details */}
                <div className="flex items-start justify-between gap-3 p-4 pb-3">
                  <div className="min-w-0">
                    <h3 className="break-words text-base font-bold text-white transition group-hover:text-teal-300">
                      {store.name}
                    </h3>

                    <p className="mt-1.5 flex items-start gap-1.5 text-xs text-slate-400">
                      <MapPin
                        size={14}
                        className="mt-0.5 shrink-0 text-teal-400"
                      />
                      <span>{store.address}</span>
                    </p>

                    <p className="mt-1.5 flex items-center gap-1.5 break-all text-xs text-slate-400">
                      <Mail
                        size={13}
                        className="shrink-0 text-blue-400"
                      />
                      {store.email}
                    </p>
                  </div>

                  <div className="shrink-0 rounded-lg border border-blue-400/20 bg-blue-500/15 p-2.5 text-blue-300">
                    <Store size={19} />
                  </div>
                </div>

                {/* Average Rating */}
                <div className="mx-4 rounded-lg border border-amber-500/20 bg-amber-500/10 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                        Overall Average Rating
                      </p>

                      <div className="mt-1.5 flex items-center gap-1.5">
                        <Star
                          size={17}
                          fill="currentColor"
                          className="text-amber-400"
                        />

                        <span className="text-xl font-bold text-white">
                          {averageRating(store)}
                        </span>

                        <span className="text-xs text-slate-400">
                          / 5.0
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-[10px] text-slate-400">
                        Rating Status
                      </p>

                      <p className="mt-1 text-xs font-semibold text-amber-300">
                        {Number(store.averageRating || 0) > 0
                          ? "Rated"
                          : "Not rated"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* User Rating */}
                <div className="p-4 pt-3">
                  <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-semibold text-white">
                        Your Rating
                      </h4>
                      <p className="mt-0.5 text-[10px] text-slate-400">
                        Select between 1 and 5 stars
                      </p>
                    </div>

                    {store.userRating && (
                      <span className="rounded-full border border-teal-500/30 bg-teal-500/10 px-2.5 py-1 text-[10px] font-medium text-teal-300">
                        Previously Rated
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <button
                          key={value}
                          onClick={() =>
                            setRatings((previous) => ({
                              ...previous,
                              [store.id]: value,
                            }))
                          }
                          className={`rounded-md p-1.5 transition ${
                            Number(ratings[store.id]) >= value
                              ? "bg-amber-500/15 text-amber-400"
                              : "bg-[#0b1736] text-slate-500 hover:text-amber-300"
                          }`}
                          title={`${value} stars`}
                          aria-label={`Give ${value} stars`}
                        >
                          <Star
                            size={18}
                            fill={
                              Number(ratings[store.id]) >= value
                                ? "currentColor"
                                : "none"
                            }
                          />
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => submitRating(store.id)}
                      disabled={submitting === store.id}
                      className="ml-auto rounded-lg bg-teal-600 px-3 py-2 text-xs font-semibold text-white shadow-md shadow-teal-950/30 transition hover:bg-teal-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {submitting === store.id
                        ? "Saving..."
                        : store.userRating
                        ? "Update Rating"
                        : "Submit Rating"}
                    </button>
                  </div>

                  <p className="mt-2 text-[10px] text-slate-500">
                    Your rating helps other customers make better decisions.
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && stores.length > 0 && (
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 rounded-xl border border-slate-600/40 bg-[#172b50] p-3">
            <button
              disabled={page <= 1}
              onClick={() => setPage((current) => current - 1)}
              className="flex items-center gap-1.5 rounded-lg border border-blue-900 bg-[#1e3a5f] px-3 py-2 text-xs text-slate-200 transition hover:border-teal-500 hover:text-teal-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={15} />
              Previous
            </button>

            <span className="text-xs font-medium text-slate-300">
              Page <span className="text-teal-400">{page}</span> of{" "}
              <span className="text-white">{totalPages}</span>
            </span>

            <button
              disabled={page >= totalPages}
              onClick={() => setPage((current) => current + 1)}
              className="flex items-center gap-1.5 rounded-lg border border-blue-900 bg-[#1e3a5f] px-3 py-2 text-xs text-slate-200 transition hover:border-teal-500 hover:text-teal-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <ChevronRight size={15} />
            </button>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-6 flex flex-col justify-between gap-1.5 border-t border-slate-700/60 pt-4 text-[10px] text-slate-500 sm:flex-row">
          <p>Roxiler Rating Management System</p>
          <p>Customer Dashboard</p>
        </footer>
      </main>
    </div>
  );
}
