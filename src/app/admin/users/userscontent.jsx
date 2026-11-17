
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import "./users.css";

export default function UsersContent({ initialUsers }) {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchUsers = async (value) => {
    setLoading(true);
    setError("");

    const supabase = createClient();

    const { data, error } = await supabase.rpc(
      "get_admin_users",
      { p_search: value.trim() }
    );

    if (error) {
      setError("Unable to search users. Please try again.");
    } else {
      setUsers(data || []);
    }

    setLoading(false);
  };

  const filteredUsers = users.filter((user) =>
    planFilter === "all" ? true : user.plan === planFilter
  );

  const handleSearch = (event) => {
    event.preventDefault();
    searchUsers(search);
  };

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <span className="admin-eyebrow">ACCOUNT MANAGEMENT</span>
          <h1>Users</h1>
          <p>View and monitor registered WEBLIVO accounts.</p>
        </div>
      </header>

      <section className="admin-users-panel">
        <div className="admin-users-toolbar">
          <form onSubmit={handleSearch} className="admin-search-form">
            <input
              type="text"
              placeholder="Search by email address..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            <button type="submit" disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </button>
          </form>

          <select
            value={planFilter}
            onChange={(event) => setPlanFilter(event.target.value)}
          >
            <option value="all">All Plans</option>
            <option value="free">Free</option>
            <option value="pro">Pro</option>
            <option value="business">Business</option>
          </select>
        </div>

        {error && <p className="admin-users-error">{error}</p>}

        <div className="admin-users-summary">
          Showing {filteredUsers.length} accounts
          {users.length === 200 && " (maximum 200 loaded)"}
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Plan</th>
                <th>AI Credits</th>
                <th>Projects Limit</th>
                <th>Published Limit</th>
                <th>Status</th>
                <th>Joined</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7">No users found.</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.user_id}>
                    <td>{user.email || "No email"}</td>
                    <td>
                      <span className={`admin-plan ${user.plan}`}>
                        {user.plan}
                      </span>
                    </td>
                    <td>{user.credits_remaining}</td>
                    <td>
                      {user.max_projects ?? "Unlimited"}
                    </td>
                    <td>{user.max_published_websites}</td>
                    <td>
                      <span className={`admin-status ${user.subscription_status}`}>
                        {user.subscription_status}
                      </span>
                    </td>
                    <td>
                      {user.created_at
                        ? new Date(user.created_at).toLocaleDateString()
                        : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
