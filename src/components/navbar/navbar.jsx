
"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Sparkles, ArrowUpRight } from "lucide-react";
import "./navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <Link href="/" className="navbar-logo" onClick={closeMenu}>
          <span className="navbar-logo-icon">
            <Sparkles size={21} />
          </span>
          <span>web<span className="logo-highlight">livo</span></span>
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
          <Link href="/login" className="navbar-login">
            Log in
          </Link>

          <Link href="/signup" className="navbar-cta">
            Get started
            <ArrowUpRight size={16} />
          </Link>
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

        <div className="mobile-actions">
          <Link href="/login" onClick={closeMenu}>Log in</Link>
          <Link href="/signup" className="navbar-cta" onClick={closeMenu}>
            Get started
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </header>
  );
}
