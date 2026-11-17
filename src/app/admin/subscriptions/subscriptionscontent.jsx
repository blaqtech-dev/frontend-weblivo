
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import "./subscriptions.css";

export default function SubscriptionsContent({
  initialSubscriptions,
}) {
  const [subscriptions, setSubscriptions] = useState(
    initialSubscriptions
  );
  const [search, setSearch] = useState("");
  const [plan, setPlan] = useState("all");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadSubscriptions = async (
    searchValue = search,
    planValue = plan,
    statusValue = status
  ) => {
    setLoading(true);
    setError("");

    const supabase = createClient();

    const { data, error } = await supabase.rpc(
      "get_admin_subscriptions",
      {
        p_search: searchValue.trim(),
        p_plan: planValue,
        p_status: statusValue,
      }
    );

    if (error) {
      setError("Unable to load subscriptions. Please try again.");
    } else {
      setSubscriptions(data || []);
    }

    setLoading(false);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    loadSubscriptions(search, plan, status);
  };

  const handlePlanChange = (value) => {
    setPlan(value);
    loadSubscriptions(search, value, status);
  };

  const handleStatusChange = (value) => {
    setStatus(value);
    loadSubscriptions(search, plan, value);
  };

  const activeCount = subscriptions.filter(
    (item) => item.subscription_status === "active"
  ).length;

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString() : "—";

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <span className="admin-eyebrow">
            SUBSCRIPTION MANAGEMENT
          </span>
          <h1>Subscriptions</h1>
          <p>Monitor customer plans, billing periods and renewals.</p>
        </div>
      </header>

      <section className="admin-subscription-stats">
        <article className="admin-stat-card">
          <span>Total Loaded Subscriptions</span>
          <strong>{subscriptions.length}</strong>
        </article>

        <article className="admin-stat-card">
          <span>Active Subscriptions</span>
          <strong>{activeCount}</strong>
        </article>

        <article className="admin-stat-card">
          <span>Other Subscription Statuses</span>
          <strong>{subscriptions.length - activeCount}</strong>
        </article>
      </section>

      <section className="admin-users-panel">
        <div className="admin-users-toolbar">
          <form
            onSubmit={handleSearch}
            className="admin-search-form"
          >
            <input
              type="text"
              placeholder="Search email or Paystack code..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            <button type="submit" disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </button>
          </form>

          <select
            value={plan}
            onChange={(event) => handlePlanChange(event.target.value)}
          >
            <option value="all">All Plans</option>
            <option value="free">Free</option>
            <option value="pro">Pro</option>
            <option value="business">Business</option>
          </select>

          <select
            value={status}
            onChange={(event) => handleStatusChange(event.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="attention">Attention</option>
          </select>
        </div>

        {error && <p className="admin-users-error">{error}</p>}

        <div className="admin-users-summary">
          Showing {subscriptions.length} subscriptions
          {subscriptions.length === 500 && " (maximum 500 loaded)"}
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Plan</th>
                <th>Status</th>
                <th>AI Credits</th>
                <th>Projects</th>
                <th>Published Limit</th>
                <th>Period Ends</th>
                <th>Paystack Subscription</th>
              </tr>
            </thead>

            <tbody>
              {subscriptions.length === 0 ? (
                <tr>
                  <td colSpan="8">No subscriptions found.</td>
                </tr>
              ) : (
                subscriptions.map((item) => (
                  <tr key={item.user_id}>
                    <td>{item.email || "Unknown user"}</td>

                    <td>
                      <span className={`admin-plan ${item.plan}`}>
                        {item.plan}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`admin-status ${item.subscription_status}`}
                      >
                        {item.subscription_status}
                      </span>
                    </td>

                    <td>{item.credits_remaining}</td>

                    <td>{item.max_projects ?? "Unlimited"}</td>

                    <td>{item.max_published_websites}</td>

                    <td>{formatDate(item.current_period_end)}</td>

                    <td>
                      {item.paystack_subscription_code || "—"}
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
