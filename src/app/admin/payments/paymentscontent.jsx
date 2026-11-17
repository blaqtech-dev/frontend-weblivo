
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import "./payments.css";

const formatMoney = (amount, currency = "NGN") =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount / 100);

export default function PaymentsContent({ initialPayments }) {
  const [payments, setPayments] = useState(initialPayments);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadPayments = async (searchValue = search, statusValue = status) => {
    setLoading(true);
    setError("");

    const supabase = createClient();

    const { data, error } = await supabase.rpc(
      "get_admin_payments",
      {
        p_search: searchValue.trim(),
        p_status: statusValue,
      }
    );

    if (error) {
      setError("Unable to load payments. Please try again.");
    } else {
      setPayments(data || []);
    }

    setLoading(false);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    loadPayments(search, status);
  };

  const handleStatusChange = (value) => {
    setStatus(value);
    loadPayments(search, value);
  };

  const successfulPayments = payments.filter(
    (payment) => payment.status === "success"
  );

  const totalRevenue = successfulPayments.reduce(
    (total, payment) => total + payment.amount,
    0
  );

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <span className="admin-eyebrow">FINANCIAL MANAGEMENT</span>
          <h1>Payments</h1>
          <p>Monitor payment transactions across WEBLIVO.</p>
        </div>
      </header>

      <section className="admin-payment-stats">
        <article className="admin-stat-card">
          <span>Total Loaded Transactions</span>
          <strong>{payments.length}</strong>
        </article>

        <article className="admin-stat-card">
          <span>Successful Payments</span>
          <strong>{successfulPayments.length}</strong>
        </article>

        <article className="admin-stat-card">
          <span>Loaded Successful Revenue</span>
          <strong>{formatMoney(totalRevenue)}</strong>
        </article>
      </section>

      <section className="admin-users-panel">
        <div className="admin-users-toolbar">
          <form onSubmit={handleSearch} className="admin-search-form">
            <input
              type="text"
              placeholder="Search email or payment reference..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            <button type="submit" disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </button>
          </form>

          <select
            value={status}
            onChange={(event) => handleStatusChange(event.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="success">Success</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        {error && <p className="admin-users-error">{error}</p>}

        <div className="admin-users-summary">
          Showing {payments.length} transactions
          {payments.length === 500 && " (maximum 500 loaded)"}
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Reference</th>
                <th>Plan</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Transaction ID</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan="7">No payment transactions found.</td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment.id}>
                    <td>{payment.email || "Unknown user"}</td>
                    <td>{payment.reference}</td>
                    <td>
                      <span className={`admin-plan ${payment.plan}`}>
                        {payment.plan}
                      </span>
                    </td>
                    <td>{formatMoney(payment.amount, payment.currency)}</td>
                    <td>
                      <span className={`admin-status ${payment.status}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td>{payment.paystack_transaction_id || "—"}</td>
                    <td>
                      {payment.paid_at
                        ? new Date(payment.paid_at).toLocaleDateString()
                        : new Date(payment.created_at).toLocaleDateString()}
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
