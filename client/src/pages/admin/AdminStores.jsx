
import { useEffect, useState } from "react";
import {
  Users,
  Store,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const initialForm = {
  name: "",
  email: "",
  address: "",
  ownerId: "",
};

export default function AdminStores() {
  const { user, logout } = useAuth();

  const [stores, setStores] = useState([]);
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const fetchStores = async () => {
    setLoading(true);

    try {
      const response = await api.get("/stores", {
        params: { search, page, limit: 10, sortBy, order },
      });

      const data = response.data;

      setStores(data.stores || []);
      setTotalPages(
        data.totalPages || data.pagination?.totalPages || 1
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load stores"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchOwners = async () => {
    try {
      const response = await api.get("/admin/users", {
        params: { role: "STORE_OWNER", limit: 100 },
      });

      setOwners(response.data.users || []);
    } catch (error) {
      toast.error("Failed to load store owners");
    }
  };

  useEffect(() => {
  fetchStores();
}, [search, page, sortBy, order]);

  useEffect(() => {
    fetchOwners();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateStore = async (e) => {
    e.preventDefault();

    if (!form.ownerId) {
      toast.error("Please select a store owner");
      return;
    }

    setSubmitting(true);

    try {
      await api.post("/stores", {
        ...form,
        ownerId: Number(form.ownerId),
      });

      toast.success("Store created successfully");

      setForm(initialForm);
      setShowForm(false);
      setPage(1);

      await fetchStores();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create store"
      );
    } finally {
      setSubmitting(false);
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

          <Link
            to="/admin"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </Link>

          <Link
            to="/admin/users"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            <Users size={20} />
            <span className="font-medium">Manage Users</span>
          </Link>

          <Link
            to="/admin/stores"
            className="flex items-center gap-3 rounded-lg bg-blue-600 px-4 py-3 transition"
          >
            <Store size={20} />
            <span className="font-medium">Manage Stores</span>
          </Link>

        </nav>

        <div className="border-t border-slate-800 p-5">
          <p className="truncate text-sm font-semibold">
            {user?.name}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Administrator
          </p>

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
              Store Management
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              View and manage registered stores.
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
          >
            {showForm ? "Close Form" : "+ Add Store"}
          </button>
        </header>

        {/* Add Store Form */}
        {showForm && (
          <form
            onSubmit={handleCreateStore}
            className="mb-8 grid gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2"
          >
            <h3 className="text-xl font-semibold md:col-span-2">
              Add New Store
            </h3>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Store name"
              required
              maxLength={60}
              className="rounded-lg border p-3"
            />

            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Store email"
              required
              className="rounded-lg border p-3"
            />

            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Store address"
              required
              maxLength={400}
              className="rounded-lg border p-3"
            />

            <select
              name="ownerId"
              value={form.ownerId}
              onChange={handleChange}
              required
              className="rounded-lg border p-3"
            >
              <option value="">Select Store Owner</option>

              {owners.map((owner) => (
                <option key={owner.id} value={owner.id}>
                  {owner.name} ({owner.email})
                </option>
              ))}
            </select>

            {owners.length === 0 && (
              <p className="text-sm text-amber-600 md:col-span-2">
                No Store Owners found. Create a STORE_OWNER account first.
              </p>
            )}

            <button
              type="submit"
              disabled={submitting || owners.length === 0}
              className="rounded-lg bg-green-600 px-5 py-3 font-medium text-white hover:bg-green-700 disabled:opacity-50 md:col-span-2"
            >
              {submitting ? "Creating..." : "Create Store"}
            </button>
          </form>
        )}

        {/* Search and Sorting */}
<div className="mb-6 grid gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-3">
  <input
    type="text"
    value={search}
    onChange={(e) => {
      setSearch(e.target.value);
      setPage(1);
    }}
    placeholder="Search stores by name or address..."
    className="rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
  />

  <select
    value={sortBy}
    onChange={(e) => {
      setSortBy(e.target.value);
      setPage(1);
    }}
    className="rounded-lg border border-slate-300 px-4 py-3"
  >
    <option value="createdAt">Sort by Date Added</option>
    <option value="name">Sort by Store Name</option>
    <option value="email">Sort by Email</option>
    <option value="address">Sort by Address</option>
  </select>

  <select
    value={order}
    onChange={(e) => {
      setOrder(e.target.value);
      setPage(1);
    }}
    className="rounded-lg border border-slate-300 px-4 py-3"
  >
    <option value="asc">Ascending (A–Z)</option>
    <option value="desc">Descending (Z–A)</option>
  </select>
</div>

        {/* Stores Table */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <p className="p-8 text-center text-slate-500">
              Loading stores...
            </p>
          ) : stores.length === 0 ? (
            <p className="p-8 text-center text-slate-500">
              No stores found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="p-4">ID</th>
                    <th className="p-4">Store Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Address</th>
                    <th className="p-4">Average Rating</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {stores.map((store) => (
                    <tr key={store.id} className="hover:bg-slate-50">
                      <td className="p-4">{store.id}</td>
                      <td className="p-4 font-medium text-slate-800">
                        {store.name}
                      </td>
                      <td className="p-4">{store.email}</td>
                      <td className="max-w-xs p-4">
                        {store.address}
                      </td>
                      <td className="p-4 font-semibold text-amber-600">
                        {Number(store.averageRating || 0).toFixed(1)} / 5
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <button
            disabled={page <= 1 || loading}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-lg border bg-white px-5 py-2 disabled:opacity-40"
          >
            Previous
          </button>

          <span className="text-sm text-slate-600">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page >= totalPages || loading}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border bg-white px-5 py-2 disabled:opacity-40"
          >
            Next
          </button>
        </div>

      </main>
    </div>
  );
}
