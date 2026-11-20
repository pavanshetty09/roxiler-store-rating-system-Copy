
import { useEffect, useState } from "react";
import {
  Users,
  Store,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
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

const inputClass =
  "w-full rounded-lg border border-slate-600 bg-[#172554] px-4 py-3 text-white placeholder-slate-400 outline-none transition focus:border-teal-400";

const selectClass =
  "w-full rounded-lg border border-slate-600 bg-[#172554] px-4 py-3 text-white outline-none transition focus:border-teal-400";

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
  const [menuOpen, setMenuOpen] = useState(false);

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

      if (page === 1) {
        await fetchStores();
      } else {
        setPage(1);
      }
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

  const closeMobileMenu = () => setMenuOpen(false);

  return (
    <div className="min-h-screen bg-[#0b1736] text-slate-200 md:flex">

      {/* Mobile Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-700 bg-[#172554] px-5 py-4 md:hidden">
        <h1 className="text-xl font-bold text-white">
          Roxiler<span className="text-teal-400">.</span>
        </h1>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg p-2 text-white transition hover:bg-white/10"
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile Overlay */}
      {menuOpen && (
        <div
          onClick={closeMobileMenu}
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-700 bg-[#172554] text-white transition-transform duration-300 md:sticky md:top-0 md:z-20 md:min-h-screen md:w-64 md:translate-x-0 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between border-b border-slate-700 p-6">
          <div>
            <h1 className="text-2xl font-bold">
              Roxiler<span className="text-teal-400">.</span>
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              Rating Management System
            </p>
          </div>

          <button
            onClick={closeMobileMenu}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/10 md:hidden"
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>

        {/* Profile */}
        <div className="m-4 rounded-xl border border-slate-600 bg-[#1e3a5f] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-teal-600 text-lg font-bold text-white">
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {user?.name}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                System Administrator
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 px-4 py-3">
          <Link
            to="/admin"
            onClick={closeMobileMenu}
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-300 transition hover:bg-[#1e3a5f] hover:text-white"
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </Link>

          <Link
            to="/admin/users"
            onClick={closeMobileMenu}
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-300 transition hover:bg-[#1e3a5f] hover:text-white"
          >
            <Users size={20} />
            <span className="font-medium">Manage Users</span>
          </Link>

          <Link
            to="/admin/stores"
            onClick={closeMobileMenu}
            className="flex items-center gap-3 rounded-lg bg-teal-700 px-4 py-3 text-white shadow-lg shadow-teal-950/30 transition hover:bg-teal-600"
          >
            <Store size={20} />
            <span className="font-medium">Manage Stores</span>
          </Link>
        </nav>

        {/* Logout */}
        <div className="border-t border-slate-700 p-5">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut size={18} />
            Logout
          </button>

          <p className="mt-3 text-center text-xs text-slate-500">
            Roxiler Rating System
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="min-w-0 flex-1 p-5 md:p-8 lg:p-10">

        {/* Page Header */}
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-medium text-teal-400">
              ADMINISTRATION / STORES
            </p>

            <h2 className="text-2xl font-bold text-white md:text-3xl">
              Store Management
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Create, search, and manage registered stores.
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="rounded-lg bg-teal-600 px-5 py-3 font-semibold text-white shadow-lg shadow-teal-950/30 transition hover:bg-teal-500"
          >
            {showForm ? "Close Form" : "+ Add Store"}
          </button>
        </header>

        {/* Add Store Form */}
        {showForm && (
          <form
            onSubmit={handleCreateStore}
            className="mb-8 grid gap-5 rounded-xl border border-slate-700 bg-[#1e3a5f] p-6 shadow-xl md:grid-cols-2"
          >
            <div className="md:col-span-2">
              <h3 className="text-xl font-semibold text-white">
                Add New Store
              </h3>
              <p className="mt-1 text-sm text-slate-400">
                Enter the store information and assign its owner.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Store Name
              </label>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter store name"
                required
                maxLength={60}
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Store Email
              </label>

              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter store email"
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Store Address
              </label>

              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Enter store address"
                required
                maxLength={400}
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Assign Store Owner
              </label>

              <select
                name="ownerId"
                value={form.ownerId}
                onChange={handleChange}
                required
                className={selectClass}
              >
                <option value="">Select Store Owner</option>

                {owners.map((owner) => (
                  <option key={owner.id} value={owner.id}>
                    {owner.name} ({owner.email})
                  </option>
                ))}
              </select>
            </div>

            {owners.length === 0 && (
              <p className="text-sm text-amber-400 md:col-span-2">
                No Store Owners found. Create a STORE_OWNER account first.
              </p>
            )}

            <button
              type="submit"
              disabled={submitting || owners.length === 0}
              className="rounded-lg bg-teal-600 px-5 py-3 font-semibold text-white transition hover:bg-teal-500 disabled:cursor-not-allowed disabled:opacity-50 md:col-span-2"
            >
              {submitting ? "Creating Store..." : "Create Store"}
            </button>
          </form>
        )}

        {/* Search and Sorting */}
        <section className="mb-6 rounded-xl border border-slate-700 bg-[#1e3a5f] p-5 shadow-lg">
          <div className="mb-4">
            <h3 className="font-semibold text-white">
              Search and Filter Stores
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Find stores and organize the results.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name or address..."
              className={inputClass}
            />

            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className={selectClass}
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
              className={selectClass}
            >
              <option value="asc">Ascending (A–Z)</option>
              <option value="desc">Descending (Z–A)</option>
            </select>
          </div>
        </section>

        {/* Stores Table */}
        <section className="overflow-hidden rounded-xl border border-slate-700 bg-[#1e3a5f] shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-700 px-5 py-4">
            <div>
              <h3 className="font-semibold text-white">
                Registered Stores
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                Store information and average ratings
              </p>
            </div>

            <span className="rounded-full bg-teal-500/10 px-3 py-1 text-xs font-medium text-teal-300">
              {stores.length} stores on this page
            </span>
          </div>

          {loading ? (
            <p className="p-10 text-center text-slate-400">
              Loading stores...
            </p>
          ) : stores.length === 0 ? (
            <div className="p-10 text-center">
              <Store
                size={36}
                className="mx-auto mb-3 text-slate-500"
              />
              <p className="font-medium text-white">
                No stores found
              </p>
              <p className="mt-1 text-sm text-slate-400">
                Try changing your search or add a new store.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px] text-left text-sm">
                <thead className="bg-[#172554] text-xs uppercase tracking-wider text-slate-300">
                  <tr>
                    <th className="p-4">ID</th>
                    <th className="p-4">Store Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Address</th>
                    <th className="p-4">Average Rating</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-700">
                  {stores.map((store) => (
                    <tr
                      key={store.id}
                      className="transition hover:bg-[#26466c]"
                    >
                      <td className="p-4 text-slate-400">
                        #{store.id}
                      </td>

                      <td className="p-4 font-semibold text-white">
                        {store.name}
                      </td>

                      <td className="p-4 text-slate-300">
                        {store.email}
                      </td>

                      <td className="max-w-xs p-4 text-slate-300">
                        <span className="line-clamp-2">
                          {store.address}
                        </span>
                      </td>

                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 rounded-lg bg-amber-500/10 px-3 py-2 font-semibold text-amber-400">
                          <span>★</span>
                          {Number(store.averageRating || 0).toFixed(1)}
                          <span className="text-xs text-amber-400/70">
                            / 5
                          </span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Pagination */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-slate-400">
            Page <span className="font-semibold text-white">{page}</span>{" "}
            of <span className="font-semibold text-white">{totalPages}</span>
          </p>

          <div className="flex gap-3">
            <button
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-lg border border-slate-600 bg-[#1e3a5f] px-5 py-2 text-sm font-medium text-slate-200 transition hover:bg-[#26466c] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <button
              disabled={page >= totalPages || loading}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg border border-teal-700 bg-teal-700 px-5 py-2 text-sm font-medium text-white transition hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}
