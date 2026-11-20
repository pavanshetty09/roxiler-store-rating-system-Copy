
import { useEffect, useState } from "react";
import {
  Users,
  Store,
  LayoutDashboard,
  LogOut,
  Plus,
  Search,
  X,
  Eye,
  Menu,
  Activity,
  ArrowUpDown,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const initialForm = {
  name: "",
  email: "",
  password: "",
  address: "",
  role: "USER",
};

export default function AdminUsers() {
  const { user, logout } = useAuth();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState("asc");
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response = await api.get("/admin/users", {
        params: {
          search,
          role: role || undefined,
          page,
          limit: 10,
          sortBy,
          order,
        },
      });

      setUsers(response.data.users || []);
      setTotalPages(response.data.pagination?.totalPages || 1);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, role, page, sortBy, order]);

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleCreateUser = async (event) => {
    event.preventDefault();

    if (form.name.trim().length < 20 || form.name.trim().length > 60) {
      toast.error("Name must contain 20 to 60 characters");
      return;
    }

    if (form.address.trim().length > 400) {
      toast.error("Address cannot exceed 400 characters");
      return;
    }

    if (
      form.password.length < 8 ||
      form.password.length > 16 ||
      !/[A-Z]/.test(form.password) ||
      !/[^A-Za-z0-9]/.test(form.password)
    ) {
      toast.error(
        "Password must be 8-16 characters with an uppercase letter and special character"
      );
      return;
    }

    try {
      setSaving(true);

      await api.post("/admin/users", {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        address: form.address.trim(),
        role: form.role,
      });

      toast.success(
        `${form.role === "STORE_OWNER" ? "Store Owner" : form.role === "ADMIN" ? "Admin" : "User"} created successfully`
      );

      setForm(initialForm);
      setShowForm(false);
      setPage(1);

      const response = await api.get("/admin/users", {
        params: {
          search,
          role: role || undefined,
          page: 1,
          limit: 10,
          sortBy,
          order,
        },
      });

      setUsers(response.data.users || []);
      setTotalPages(response.data.pagination?.totalPages || 1);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to create user"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleViewDetails = async (userId) => {
    try {
      setDetailsLoading(true);
      setShowDetails(true);
      setSelectedUser(null);

      const response = await api.get(`/admin/users/${userId}`);
      setSelectedUser(response.data.user);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to load user details"
      );
      setShowDetails(false);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
  };

  const closeMenu = () => setMenuOpen(false);

  const navigation = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Manage Users",
      path: "/admin/users",
      icon: Users,
      active: true,
    },
    {
      name: "Manage Stores",
      path: "/admin/stores",
      icon: Store,
    },
  ];

  const inputClass =
    "w-full rounded-xl border border-slate-600/70 bg-[#172b4d] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 transition focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20";

  const selectClass =
    "rounded-xl border border-slate-600/70 bg-[#172b4d] px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-teal-400";

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0b1736] text-slate-200 md:flex">

      {/* Mobile Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-700/60 bg-[#172554] px-5 py-4 md:hidden">
        <div>
          <h1 className="text-xl font-bold text-white">
            Roxiler<span className="text-teal-400">.</span>
          </h1>
          <p className="text-xs text-slate-400">Management Portal</p>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-xl p-2 text-slate-300 hover:bg-white/10"
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </header>

      {/* Mobile Overlay */}
      {menuOpen && (
        <button
          type="button"
          onClick={closeMenu}
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-700/60 bg-[#172554] text-white transition-transform duration-300 md:sticky md:top-0 md:z-20 md:min-h-screen md:w-64 md:translate-x-0 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-700/60 p-6">
          <div>
            <h1 className="text-2xl font-bold">
              Roxiler<span className="text-teal-400">.</span>
            </h1>
            <p className="mt-1 text-xs tracking-wide text-slate-400">
              CRM MANAGEMENT SYSTEM
            </p>
          </div>

          <button
            onClick={closeMenu}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/10 md:hidden"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Admin Profile */}
        <div className="mx-4 mt-6 rounded-2xl border border-slate-600/40 bg-[#1e3a5f] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-lg font-bold text-white">
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {user?.name || "Administrator"}
              </p>
              <p className="mt-1 text-xs text-teal-300">
                System Administrator
              </p>
            </div>
          </div>
        </div>

        <div className="px-5 pb-2 pt-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
            Main Menu
          </p>
        </div>

        <nav className="flex-1 space-y-2 px-4">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMenu}
                className={`group flex items-center gap-3 rounded-xl px-4 py-3.5 transition ${
                  item.active
                    ? "bg-teal-700 text-white shadow-lg shadow-teal-950/30"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={19} />
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

        <div className="border-t border-slate-700/60 p-5">
          <div className="mb-4 flex items-center gap-2 text-xs text-slate-400">
            <Activity size={15} className="text-teal-400" />
            <span>Platform Management</span>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-300 transition hover:bg-red-500/10 hover:text-red-200"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-9 lg:py-8">

        {/* Page Header */}
        <header className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-teal-400" />
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-400">
                User Management
              </p>
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Manage Users
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Create and manage users, administrators and store owners.
            </p>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-950/30 transition hover:bg-teal-600"
          >
            <Plus size={18} />
            Add User
          </button>
        </header>

        {/* Create User Form */}
        {showForm && (
          <section className="mb-7 rounded-2xl border border-slate-600/50 bg-[#1e3a5f] p-5 shadow-lg sm:p-7">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">
                  Create New User
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                  Enter the account details below.
                </p>
              </div>

              <button
                onClick={() => {
                  setShowForm(false);
                  setForm(initialForm);
                }}
                className="rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateUser}>
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Full Name
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleFormChange}
                    required
                    minLength={20}
                    maxLength={60}
                    placeholder="Enter full name (20-60 characters)"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleFormChange}
                    required
                    placeholder="Enter email address"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleFormChange}
                    required
                    minLength={8}
                    maxLength={16}
                    placeholder="8-16 characters"
                    className={inputClass}
                  />
                  <p className="mt-2 text-xs text-slate-400">
                    Include an uppercase letter and a special character.
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Role
                  </label>
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleFormChange}
                    className={`${inputClass} appearance-none`}
                  >
                    <option value="USER">Normal User</option>
                    <option value="STORE_OWNER">Store Owner</option>
                    <option value="ADMIN">Administrator</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleFormChange}
                    required
                    maxLength={400}
                    rows={3}
                    placeholder="Enter complete address"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-wrap justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setForm(initialForm);
                  }}
                  className="rounded-xl border border-slate-600 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/5"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-600 disabled:opacity-50"
                >
                  {saving ? "Creating..." : "Create User"}
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Search and Filters */}
        <section className="mb-6 rounded-2xl border border-slate-600/40 bg-[#1e3a5f] p-4 shadow-lg sm:p-5">
          <div className="mb-4 flex items-center gap-2">
            <Search size={17} className="text-teal-400" />
            <h3 className="text-sm font-semibold text-white">
              Search and Filter Users
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-3.5 text-slate-500"
                size={18}
              />
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                className={`${inputClass} pl-10`}
              />
            </div>

            <select
              value={role}
              onChange={(event) => {
                setRole(event.target.value);
                setPage(1);
              }}
              className={selectClass}
            >
              <option value="">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="USER">Normal User</option>
              <option value="STORE_OWNER">Store Owner</option>
            </select>

            <select
              value={sortBy}
              onChange={(event) => {
                setSortBy(event.target.value);
                setPage(1);
              }}
              className={selectClass}
            >
              <option value="name">Sort by Name</option>
              <option value="email">Sort by Email</option>
              <option value="role">Sort by Role</option>
              <option value="createdAt">Sort by Date</option>
            </select>

            <select
              value={order}
              onChange={(event) => {
                setOrder(event.target.value);
                setPage(1);
              }}
              className={selectClass}
            >
              <option value="asc">Ascending (A–Z)</option>
              <option value="desc">Descending (Z–A)</option>
            </select>
          </div>
        </section>

        {/* Users Table */}
        <section className="overflow-hidden rounded-2xl border border-slate-600/40 bg-[#1e3a5f] shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-600/50 px-5 py-5">
            <div>
              <h3 className="text-base font-semibold text-white">
                Registered Users
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                View and manage platform accounts
              </p>
            </div>

            <span className="rounded-lg border border-teal-500/20 bg-teal-500/10 px-3 py-1.5 text-xs font-medium text-teal-300">
              Page {page} of {totalPages}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-[#172b4d] text-slate-300">
                <tr>
                  <th className="px-5 py-4 font-semibold">ID</th>
                  <th className="px-5 py-4 font-semibold">Name</th>
                  <th className="px-5 py-4 font-semibold">Email</th>
                  <th className="px-5 py-4 font-semibold">Address</th>
                  <th className="px-5 py-4 font-semibold">Role</th>
                  <th className="px-5 py-4 font-semibold">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-600/40">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-5 py-12 text-center text-slate-400">
                      Loading users...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-5 py-12 text-center text-slate-400">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((item) => (
                    <tr
                      key={item.id}
                      className="transition hover:bg-[#29486d]/60"
                    >
                      <td className="px-5 py-4 text-slate-400">
                        #{item.id}
                      </td>

                      <td className="px-5 py-4 font-medium text-white">
                        {item.name}
                      </td>

                      <td className="px-5 py-4 text-slate-300">
                        {item.email}
                      </td>

                      <td className="max-w-xs truncate px-5 py-4 text-slate-400">
                        {item.address}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            item.role === "ADMIN"
                              ? "bg-purple-500/15 text-purple-300"
                              : item.role === "STORE_OWNER"
                                ? "bg-blue-500/15 text-blue-300"
                                : "bg-teal-500/15 text-teal-300"
                          }`}
                        >
                          {item.role === "USER"
                            ? "Normal User"
                            : item.role === "STORE_OWNER"
                              ? "Store Owner"
                              : "Administrator"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <button
                          onClick={() => handleViewDetails(item.id)}
                          className="flex items-center gap-2 rounded-lg border border-teal-500/20 bg-teal-500/10 px-3 py-2 text-xs font-semibold text-teal-300 transition hover:bg-teal-500/20"
                        >
                          <Eye size={15} />
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-600/50 px-5 py-5">
            <p className="text-xs text-slate-400">
              Showing page {page} of {totalPages}
            </p>

            <div className="flex items-center gap-3">
              <button
                disabled={page <= 1}
                onClick={() => setPage((current) => current - 1)}
                className="rounded-xl border border-slate-600 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <span className="text-sm font-semibold text-white">
                {page} / {totalPages}
              </span>

              <button
                disabled={page >= totalPages}
                onClick={() => setPage((current) => current + 1)}
                className="rounded-xl border border-slate-600 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </section>

        {/* User Details Modal */}
        {showDetails && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-600/50 bg-[#172554] p-5 shadow-2xl sm:p-7">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    User Details
                  </h3>
                  <p className="mt-1 text-xs text-slate-400">
                    Account information and store performance
                  </p>
                </div>

                <button
                  onClick={() => {
                    setShowDetails(false);
                    setSelectedUser(null);
                  }}
                  className="rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              {detailsLoading ? (
                <p className="py-10 text-center text-slate-400">
                  Loading user details...
                </p>
              ) : selectedUser ? (
                <div className="space-y-6">
                  <div className="grid gap-5 rounded-xl border border-slate-600/50 bg-[#1e3a5f] p-5 sm:grid-cols-2">
                    {[
                      ["User ID", selectedUser.id],
                      ["Name", selectedUser.name],
                      ["Email", selectedUser.email],
                      ["Role", selectedUser.role],
                      ["Address", selectedUser.address],
                      [
                        "Account Created",
                        new Date(selectedUser.createdAt).toLocaleDateString(),
                      ],
                    ].map(([label, value]) => (
                      <div key={label} className={label === "Address" ? "sm:col-span-2" : ""}>
                        <p className="text-xs font-medium text-slate-400">
                          {label}
                        </p>
                        <p className="mt-1 break-words text-sm font-semibold text-white">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {selectedUser.role === "STORE_OWNER" && (
                    <div className="border-t border-slate-600/50 pt-5">
                      <h4 className="mb-4 font-bold text-white">
                        Store Rating Details
                      </h4>

                      {selectedUser.ownedStores?.length > 0 ? (
                        <div className="space-y-3">
                          {selectedUser.ownedStores.map((store) => (
                            <div
                              key={store.id}
                              className="rounded-xl border border-slate-600/50 bg-[#1e3a5f] p-4"
                            >
                              <p className="font-semibold text-white">
                                {store.name}
                              </p>

                              <div className="mt-4 grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-xs text-slate-400">
                                    Average Rating
                                  </p>
                                  <p className="mt-1 text-xl font-bold text-amber-400">
                                    {Number(store.averageRating).toFixed(2)} / 5
                                  </p>
                                </div>

                                <div>
                                  <p className="text-xs text-slate-400">
                                    Total Ratings
                                  </p>
                                  <p className="mt-1 text-xl font-bold text-teal-300">
                                    {store.totalRatings}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-slate-400">
                          This store owner has no stores yet.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ) : null}

              <div className="mt-7 flex justify-end">
                <button
                  onClick={() => {
                    setShowDetails(false);
                    setSelectedUser(null);
                  }}
                  className="rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-10 flex flex-col justify-between gap-2 border-t border-slate-700/60 pt-6 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Roxiler CRM. All rights reserved.</p>
          <p>Store Rating Management Platform</p>
        </footer>
      </main>
    </div>
  );
}
