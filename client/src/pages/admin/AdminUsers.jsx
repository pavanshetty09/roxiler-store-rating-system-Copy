
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

      // Refresh the user list after creation.
      const response = await api.get("/admin/users", {
        params: {
          search,
          role: role || undefined,
          page: 1,
          limit: 10,
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
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-300 hover:bg-slate-800"
          >
            <LayoutDashboard size={20} />
            Dashboard
          </Link>

          <Link
            to="/admin/users"
            className="flex items-center gap-3 rounded-lg bg-blue-600 px-4 py-3 font-medium"
          >
            <Users size={20} />
            Manage Users
          </Link>

          <Link
            to="/admin/stores"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-300 hover:bg-slate-800"
          >
            <Store size={20} />
            Manage Stores
          </Link>
        </nav>

        <div className="border-t border-slate-800 p-5">
          <p className="truncate text-sm font-semibold">{user?.name}</p>
          <p className="mt-1 text-xs text-slate-400">Administrator</p>

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
              Manage Users
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Create and manage users, admins and store owners.
            </p>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Plus size={18} />
            Add User
          </button>
        </header>

        {/* Create User Form */}
        {showForm && (
          <div className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">
                Create New User
              </h3>

              <button
                onClick={() => {
                  setShowForm(false);
                  setForm(initialForm);
                }}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateUser}>
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
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
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleFormChange}
                    required
                    placeholder="Enter email address"
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
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
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    Include an uppercase letter and a special character.
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Role
                  </label>
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleFormChange}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 outline-none focus:border-blue-500"
                  >
                    <option value="USER">Normal User</option>
                    <option value="STORE_OWNER">Store Owner</option>
                    <option value="ADMIN">Administrator</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
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
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500"
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
                  className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? "Creating..." : "Create User"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-3 text-slate-400"
              size={19}
            />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={role}
            onChange={(event) => {
              setRole(event.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 outline-none focus:border-blue-500"
          >
            <option value="">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="USER">Normal User</option>
            <option value="STORE_OWNER">Store Owner</option>
          </select>
            {/* Sort By */}
<select
  value={sortBy}
  onChange={(event) => {
    setSortBy(event.target.value);
    setPage(1);
  }}
  className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 outline-none focus:border-blue-500"
>
  <option value="name">Sort by Name</option>
  <option value="email">Sort by Email</option>
  <option value="role">Sort by Role</option>
  <option value="createdAt">Sort by Date</option>
</select>

{/* Sort Order */}
<select
  value={order}
  onChange={(event) => {
    setOrder(event.target.value);
    setPage(1);
  }}
  className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 outline-none focus:border-blue-500"
>
  <option value="asc">Ascending (A–Z)</option>
  <option value="desc">Descending (Z–A)</option>
</select>

        </div>

        {/* Users Table */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-5 py-4 font-semibold">ID</th>
                  <th className="px-5 py-4 font-semibold">Name</th>
                  <th className="px-5 py-4 font-semibold">Email</th>
                  <th className="px-5 py-4 font-semibold">Address</th>
                  <th className="px-5 py-4 font-semibold">Role</th>
                  <th className="px-5 py-4 font-semibold">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-5 py-10 text-center text-slate-500">
                      Loading users...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-5 py-10 text-center text-slate-500">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="px-5 py-4">{item.id}</td>
                      <td className="px-5 py-4 font-medium text-slate-900">
                        {item.name}
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {item.email}
                      </td>
                      <td className="max-w-xs px-5 py-4 text-slate-600">
                        {item.address}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            item.role === "ADMIN"
                              ? "bg-purple-100 text-purple-700"
                              : item.role === "STORE_OWNER"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {item.role}
                        </span>
                      </td>
                      <td className="px-5 py-4">
  <button
    onClick={() => handleViewDetails(item.id)}
    className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100"
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
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-center gap-4">
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
        {/* User Details Modal */}
{showDetails && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-900">
          User Details
        </h3>

        <button
          onClick={() => {
            setShowDetails(false);
            setSelectedUser(null);
          }}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
        >
          <X size={20} />
        </button>
      </div>

      {detailsLoading ? (
        <p className="py-8 text-center text-slate-500">
          Loading user details...
        </p>
      ) : selectedUser ? (
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium text-slate-500">User ID</p>
              <p className="mt-1 font-semibold text-slate-900">{selectedUser.id}</p>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-500">Name</p>
              <p className="mt-1 font-semibold text-slate-900">{selectedUser.name}</p>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-500">Email</p>
              <p className="mt-1 break-all font-semibold text-slate-900">{selectedUser.email}</p>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-500">Role</p>
              <p className="mt-1 font-semibold text-slate-900">{selectedUser.role}</p>
            </div>

            <div className="sm:col-span-2">
              <p className="text-xs font-medium text-slate-500">Address</p>
              <p className="mt-1 font-semibold text-slate-900">{selectedUser.address}</p>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-500">Account Created</p>
              <p className="mt-1 text-sm text-slate-700">
                {new Date(selectedUser.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {selectedUser.role === "STORE_OWNER" && (
            <div className="border-t border-slate-200 pt-5">
              <h4 className="mb-4 font-bold text-slate-900">
                Store Rating Details
              </h4>

              {selectedUser.ownedStores?.length > 0 ? (
                <div className="space-y-3">
                  {selectedUser.ownedStores.map((store) => (
                    <div key={store.id} className="rounded-lg border border-slate-200 p-4">
                      <p className="font-semibold text-slate-900">{store.name}</p>

                      <div className="mt-3 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-slate-500">Average Rating</p>
                          <p className="mt-1 text-lg font-bold text-amber-600">
                            {Number(store.averageRating).toFixed(2)} / 5
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-500">Total Ratings</p>
                          <p className="mt-1 text-lg font-bold text-slate-900">
                            {store.totalRatings}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">
                  This store owner has no stores yet.
                </p>
              )}
            </div>
          )}
        </div>
      ) : null}

      <div className="mt-6 flex justify-end">
        <button
          onClick={() => {
            setShowDetails(false);
            setSelectedUser(null);
          }}
          className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

      </main>
    </div>
  );
}
