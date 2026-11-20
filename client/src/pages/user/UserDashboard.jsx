
import { useEffect, useState } from "react";
import {
  Store,
  Star,
  LayoutDashboard,
  LogOut,
  Search,
  RefreshCw,
  KeyRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
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
      fetchStores();
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
          <p className="truncate text-sm font-semibold">{user?.name}</p>
          <p className="mt-1 text-xs text-slate-400">Normal User</p>

        <button
  onClick={() => navigate("/update-password")}
  className="mt-4 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-blue-400 transition hover:bg-slate-800"
>
  <KeyRound size={18} />
  Update Password
</button>

          <button
            onClick={handleLogout}
            className="mt-5 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-slate-800"
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
              User Dashboard
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Discover stores and share your ratings.
            </p>
          </div>

          <button
            onClick={fetchStores}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </header>

        {/* Search and Sorting */}
<div className="mb-6 grid gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-3">
  <div className="relative">
    <Search
      className="absolute left-3 top-3 text-slate-400"
      size={19}
    />
    <input
      type="text"
      placeholder="Search stores by name or address..."
      value={search}
      onChange={(event) => {
        setSearch(event.target.value);
        setPage(1);
      }}
      className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 outline-none focus:border-blue-500"
    />
  </div>

  <select
    value={sortBy}
    onChange={(e) => {
      setSortBy(e.target.value);
      setPage(1);
    }}
    className="rounded-lg border border-slate-300 px-4 py-2.5"
  >
    <option value="name">Sort by Store Name</option>
    <option value="email">Sort by Email</option>
    <option value="address">Sort by Address</option>
    <option value="createdAt">Sort by Date Added</option>
  </select>

  <select
    value={order}
    onChange={(e) => {
      setOrder(e.target.value);
      setPage(1);
    }}
    className="rounded-lg border border-slate-300 px-4 py-2.5"
  >
    <option value="asc">Ascending (A–Z)</option>
    <option value="desc">Descending (Z–A)</option>
  </select>
</div>

        {/* Store List */}
        {loading ? (
          <div className="rounded-xl bg-white p-10 text-center text-slate-500">
            Loading stores...
          </div>
        ) : stores.length === 0 ? (
          <div className="rounded-xl bg-white p-10 text-center text-slate-500">
            No stores found.
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
                    <h3 className="text-lg font-bold text-slate-900">
                      {store.name}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {store.address}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {store.email}
                    </p>
                  </div>

                  <div className="rounded-lg bg-yellow-100 p-3 text-yellow-600">
                    <Store size={22} />
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between rounded-lg bg-slate-50 p-4">
                  <span className="text-sm text-slate-600">
                    Average Rating
                  </span>

                  <span className="flex items-center gap-1 font-bold text-yellow-600">
                    <Star size={17} fill="currentColor" />
                    {Number(store.averageRating || 0).toFixed(1)} / 5
                  </span>
                </div>

                <div className="mt-5">
                  <p className="mb-3 text-sm font-semibold text-slate-800">
                    Your Rating
                  </p>

                  <div className="flex flex-wrap items-center gap-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        onClick={() =>
                          setRatings((previous) => ({
                            ...previous,
                            [store.id]: value,
                          }))
                        }
                        className={`rounded-lg p-2 transition ${
                          Number(ratings[store.id]) >= value
                            ? "bg-yellow-100 text-yellow-500"
                            : "bg-slate-100 text-slate-400"
                        }`}
                        title={`${value} stars`}
                      >
                        <Star
                          size={22}
                          fill={
                            Number(ratings[store.id]) >= value
                              ? "currentColor"
                              : "none"
                          }
                        />
                      </button>
                    ))}

                    <button
                      onClick={() => submitRating(store.id)}
                      disabled={submitting === store.id}
                      className="ml-auto rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                      {submitting === store.id
                        ? "Saving..."
                        : store.userRating
                        ? "Update Rating"
                        : "Submit Rating"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && stores.length > 0 && (
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              disabled={page <= 1}
              onClick={() => setPage((current) => current - 1)}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm disabled:opacity-40"
            >
              Previous
            </button>

            <span className="text-sm text-slate-600">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page >= totalPages}
              onClick={() => setPage((current) => current + 1)}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
