
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

import {
  LayoutDashboard,
  Globe,
  Plus,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  X,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import "./dashboardshell.css";

const navigation = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "My Websites",
    href: "/projects",
    icon: Globe,
  },
  {
    title:'Upgrade Plan',
    href:'/pricing',
    icon:Sparkles,
  }
];

   


export default function DashboardShell({
  children,
  email,
  appearance = "light",
   creditsRemaining = 0,
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);

    const { error } = await supabase.auth.signOut();

    if (error) {
      setLoggingOut(false);
      return;
    }

    router.push("/login");
    router.refresh();
  };

  return (
   <div className={`dashboard-layout ${appearance === "dark" ? "dark-theme" : "light-theme"}`}>
      {mobileOpen && (
        <button
          className="dashboard-overlay"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        />
      )}

      <aside className={`dashboard-sidebar ${mobileOpen ? "open" : ""}`}>
        <Link href="/" className="dashboard-logo">
          <span className="dashboard-logo-icon">
            <Sparkles size={21} />
          </span>
          <span>web<span>livo</span></span>
        </Link>

        <div className="sidebar-section">
          <p className="sidebar-label">WORKSPACE</p>

          <nav className="sidebar-navigation">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`sidebar-link ${active ? "active" : ""}`}
                  onClick={() => setMobileOpen(false)}
                >
                  <Icon size={19} />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </nav>
        </div>

   
        <Link
         href="/create"
          className="sidebar-create-button"
          onClick={() => setMobileOpen(false)}
        >
          <Plus size={19} />
          <span>Create Website</span>
        </Link>

        <div className="sidebar-bottom">
          <Link href="/settings" className="sidebar-link">
            <Settings size={19} />
            <span>Settings</span>
          </Link>

         
            
<Link href="/help" className="sidebar-link">
  <HelpCircle size={19} />
  <span>Help & Support</span>
</Link>
          <div className="sidebar-user">
            <div className="sidebar-avatar">
              {email?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div className="sidebar-user-info">
              <span className="sidebar-user-name">Your Account</span>
              <span className="sidebar-user-email">{email || "Account"}</span>
            </div>

            <button
              className="sidebar-logout"
              onClick={handleLogout}
              disabled={loggingOut}
              title="Log out"
            >
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </aside>

      <div className="dashboard-main">
        <header className="dashboard-topbar">
          <button
            className="dashboard-mobile-menu"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          <div className="topbar-breadcrumb">
            <span>Workspace</span>
            <span>/</span>
            <strong>Dashboard</strong>
          </div>

          <div className="topbar-right">
           <div className="topbar-credit">
  <Sparkles size={16} />
  <span>AI Credits</span>
  <strong>{creditsRemaining}</strong>
</div>

            <div className="topbar-user">
              <div className="topbar-avatar">
                {email?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <ChevronDown size={15} />
            </div>
          </div>
        </header>

        <main className="dashboard-content">
          {children}
        </main>
      </div>
    </div>
  );
}
