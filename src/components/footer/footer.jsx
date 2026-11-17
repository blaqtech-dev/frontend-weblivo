
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

import { Sparkles, ArrowUpRight } from "lucide-react";
import "./footer.css";

const productLinks = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Templates", href: "#templates" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQs", href: "#faq" },
];

export default function Footer() {
  const [destination, setDestination] = useState("/signup");

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;

    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (mounted) {
        setDestination(user ? "/create" : "/signup");
      }
    };

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setDestination(session?.user ? "/create" : "/signup");
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-main">

          <div className="footer-brand">
            <Link href="/" className="footer-logo">
              <span className="footer-logo-icon">
                <Sparkles size={21} />
              </span>

              <span>
                web<span className="footer-logo-highlight">livo</span>
              </span>
            </Link>

            <p>
              Turn your ideas into beautiful websites.
              Build, customize and grow your online presence
              with the power of AI.
            </p>

            <Link href={destination} className="footer-brand-cta">
              Start building <ArrowUpRight size={16} />
            </Link>
          </div>

          <div className="footer-column">
            <h3>Product</h3>

            {productLinks.map((link) => (
              <a href={link.href} key={link.label}>
                {link.label}
              </a>
            ))}
          </div>

          <div className="footer-column">
            <h3>Get started</h3>

            <Link href="/signup">Create an account</Link>
            <Link href="/login">Log in</Link>
            <Link href={destination}>Build a website</Link>
          </div>

          <div className="footer-column footer-contact">
            <h3>Let's connect</h3>

            <p>
              Have a question or want to learn more about
              WEBLIVO? We're here to help.
            </p>

           <Link href="/help" className="footer-coming-soon">
  Contact support
</Link>
          </div>

        </div>

        <div className="footer-bottom">
          © 2026 WEBLIVO. All rights reserved.

          <p className="footer-bottom-tagline">
            Built to turn ideas into reality.
          </p>
        </div>
      </div>
    </footer>
  );
}
