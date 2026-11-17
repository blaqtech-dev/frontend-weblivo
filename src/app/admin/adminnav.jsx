
import Link from "next/link";
import "./adminnav.css";

const links = [
  { label: "Overview", href: "/admin" },
  { label: "Users", href: "/admin/users" },
  { label: "Payments", href: "/admin/payments" },
  { label: "Subscriptions", href: "/admin/subscriptions" },
];

export default function AdminNav() {
  return (
    <nav className="admin-nav">
      <Link href="/admin" className="admin-nav-brand">
        WEBLIVO <span>ADMIN</span>
      </Link>

      <div className="admin-nav-links">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="admin-nav-link"
          >
            {link.label}
          </Link>
        ))}
      </div>

      <Link href="/dashboard" className="admin-nav-exit">
        Exit Admin
      </Link>
    </nav>
  );
}
