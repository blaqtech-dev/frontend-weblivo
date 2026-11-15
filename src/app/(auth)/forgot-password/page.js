
"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Sparkles } from "lucide-react";

export default function ForgotPasswordPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      });

      if (error) throw error;

      setMessage(
        "If an account exists with that email, a password recovery link will be sent."
      );
    } catch (err) {
      setError(err.message || "Unable to send recovery email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link href="/" className="auth-logo">
          <span className="auth-logo-icon">
            <Sparkles size={21} />
          </span>
          <span>web<span>livo</span></span>
        </Link>

        <div className="auth-heading">
          <h1>Forgot your password?</h1>
          <p>
            Enter your email address and we'll send you a link
            to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          {error && <p className="auth-error">{error}</p>}
          {message && <p className="auth-success">{message}</p>}

          <button className="auth-submit" disabled={loading}>
            {loading ? "Sending..." : "Send recovery link"}
          </button>
        </form>

        <p className="auth-switch">
          Remember your password? <Link href="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
