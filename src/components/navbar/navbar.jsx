
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  Sparkles,
  ArrowUpRight,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import "./navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (!error) {
        setUser(data.user);
      }

      setLoading(false);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      setLoading(false);

      if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        router.refresh();
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const closeMenu = () => setMenuOpen(false);

const handleLogout = async () => {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Logout error:", error.message);
    return;
  }

  setUser(null);
  closeMenu();
  router.replace("/login");
  router.refresh();
};
  return (
    <header className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <Link href="/" className="navbar-logo" onClick={closeMenu}>
          <span className="navbar-logo-icon">
            <Sparkles size={21} />
          </span>
          <span>
            web<span className="logo-highlight">livo</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="navbar-links">
          <Link href="/" className="navbar-link">Home</Link>
          <Link href="/#features" className="navbar-link">Features</Link>
          <Link href="/#how-it-works" className="navbar-link">
            How it works
          </Link>
          <Link href="/#pricing" className="navbar-link">Pricing</Link>
        </nav>

        {/* Desktop Actions */}
        <div className="navbar-actions">
          {!loading && (
            user ? (
              <>
                <Link href="/dashboard" className="navbar-login">
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>

                <button
                  type="button"
                  className="navbar-cta"
                  onClick={handleLogout}
                >
                  Logout
                  <LogOut size={16} />
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="navbar-login">
                  Log in
                </Link>

                <Link href="/signup" className="navbar-cta">
                  Get started
                  <ArrowUpRight size={16} />
                </Link>
              </>
            )
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="navbar-menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className={`navbar-mobile ${menuOpen ? "mobile-open" : ""}`}>
        <Link href="/" onClick={closeMenu}>Home</Link>
        <Link href="/#features" onClick={closeMenu}>Features</Link>
        <Link href="/#how-it-works" onClick={closeMenu}>
          How it works
        </Link>
        <Link href="/#pricing" onClick={closeMenu}>Pricing</Link>

        {!loading && (
          <div className="mobile-actions">
            {user ? (
              <>
                <Link href="/dashboard" onClick={closeMenu}>
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>

                <button type="button" onClick={handleLogout}>
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={closeMenu}>Log in</Link>

                <Link
                  href="/signup"
                  className="navbar-cta"
                  onClick={closeMenu}
                >
                  Get started
                  <ArrowUpRight size={16} />
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
