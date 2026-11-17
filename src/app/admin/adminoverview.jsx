
import Link from "next/link";


const formatMoney = (amount) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);

export default function AdminOverview({
  stats,
  payments,
  billing,
}) {
  const cards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      description: "Registered accounts",
    },
    {
      label: "Pro Subscribers",
      value: stats.proUsers,
      description: "Active or inactive plan records",
    },
    {
      label: "Business Subscribers",
      value: stats.businessUsers,
      description: "Business plan accounts",
    },
    {
      label: "Free Users",
      value: stats.freeUsers,
      description: "Free plan accounts",
    },
    {
      label: "Total Revenue",
      value: formatMoney(stats.totalRevenue),
      description: "Successful recorded payments",
    },
  ];

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <span className="admin-eyebrow">WEBLIVO CONTROL CENTER</span>
          <h1>Admin Overview</h1>
          <p>Monitor your platform, users and subscriptions.</p>
        </div>

        <Link href="/dashboard" className="admin-back-link">
          Back to Dashboard
        </Link>
      </header>

      <section className="admin-stats-grid">
        {cards.map((card) => (
          <article className="admin-stat-card" key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
            <small>{card.description}</small>
          </article>
        ))}
      </section>

      <section className="admin-section">
        <div className="admin-section-heading">
          <div>
            <h2>Recent Payments</h2>
            <p>Latest payment transactions recorded on WEBLIVO.</p>
          </div>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Plan</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan="5">No payment transactions yet.</td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment.id}>
                    <td>{payment.email || "Unknown user"}</td>
                    <td>{payment.plan}</td>
                    <td>{formatMoney(payment.amount / 100)}</td>
                    <td>
                      <span
                        className={`admin-status ${payment.status}`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td>
                      {payment.created_at
                        ? new Date(payment.created_at).toLocaleDateString()
                        : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="admin-section">
        <div className="admin-section-heading">
          <div>
            <h2>Subscription Activity</h2>
            <p>Recent user plans and remaining AI credits.</p>
          </div>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Plan</th>
                <th>Credits</th>
                <th>Status</th>
                <th>Period Ends</th>
              </tr>
            </thead>

            <tbody>
              {billing.length === 0 ? (
                <tr>
                  <td colSpan="5">No billing records found.</td>
                </tr>
              ) : (
                billing.map((account, index) => (
                  <tr key={`${account.email}-${index}`}>
                    <td>{account.email || "Unknown user"}</td>
                    <td>{account.plan}</td>
                    <td>{account.credits_remaining}</td>
                    <td>
                      <span
                        className={`admin-status ${account.subscription_status}`}
                      >
                        {account.subscription_status}
                      </span>
                    </td>
                    <td>
                      {account.current_period_end
                        ? new Date(
                            account.current_period_end
                          ).toLocaleDateString()
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
