
"use client";

import { useState } from "react";
import {
  ArrowRight,
  Sparkles,
  Globe,
  WandSparkles,
  LayoutTemplate,
  CheckCircle2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import "./hero.css";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
export default function Hero() {
    const router = useRouter();
  const [prompt, setPrompt] = useState("");

const handleGenerate = async () => {
  const idea = prompt.trim();

  if (!idea) return;

  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    router.push(`/create?idea=${encodeURIComponent(idea)}`);
  } else {
    router.push(`/signup?idea=${encodeURIComponent(idea)}`);
  }
};
  return (
    <section className="hero-section">
      <div className="hero-background-glow"></div>

      <div className="hero-container">

        <div className="hero-content">

          <div className="hero-badge">
            <Sparkles size={14} />
            <span>The smarter way to build websites</span>
          </div>

          <h1>
            Turn your ideas into
            <span> beautiful websites.</span>
          </h1>

          <p className="hero-description">
            Describe the website you want. WEBLIVO's AI transforms
            your ideas into professional, responsive websites
            ready for your business.
          </p>

          <div className="hero-prompt-wrapper">
            <div className="hero-prompt-top">
              <Sparkles size={18} />
              <span>What would you like to create?</span>
            </div>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Create a modern website for my beauty salon with a gallery section and a beautiful layout"
              rows={3}
            />

            <div className="hero-prompt-bottom">
              <span className="hero-prompt-hint">
                <WandSparkles size={14} />
                Powered by AI
              </span>

              <button
                onClick={handleGenerate}
                disabled={!prompt.trim()}
              >
                Create my website
                <ArrowRight size={17} />
              </button>
            </div>
          </div>

          <div className="hero-trust">
            <span>
              <CheckCircle2 size={15} />
              No coding required
            </span>
            <span>
              <CheckCircle2 size={15} />
              Mobile responsive
            </span>
            <span>
              <CheckCircle2 size={15} />
              Built in minutes
            </span>
          </div>

        </div>

        <div className="hero-visual">

          <div className="hero-visual-label">
            <span className="hero-live-dot"></span>
            AI website preview
          </div>

          <div className="hero-preview-window">

            <div className="preview-browser-bar">
              <div className="preview-browser-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>

              <div className="preview-browser-address">
                yourbusiness.weblivo.app
              </div>

              <Globe size={15} />
            </div>

            <div className="preview-website">

              <div className="preview-website-nav">
                <div className="preview-brand">
                  <span className="preview-brand-icon">L</span>
                  LUMI BEAUTY
                </div>

                <div className="preview-nav-links">
                  <span>Home</span>
                  <span>Services</span>
                  <span>About</span>
                  <span>Contact</span>
                </div>

                <div className="preview-book-button">
                  Book now
                </div>
              </div>

              <div className="preview-website-hero">

                <div className="preview-website-text">
                  <span className="preview-eyebrow">
                    YOUR BEAUTY, OUR PASSION
                  </span>

                  <h3>
                    Feel beautiful.
                    <br />
                    Be confident.
                  </h3>

                  <p>
                    Discover a beauty experience designed
                    around you.
                  </p>

                  <div className="preview-website-cta">
                    Explore services
                    <ArrowRight size={12} />
                  </div>
                </div>

                <div className="preview-website-image">
                  <div className="preview-image-placeholder">
                    <WandSparkles size={27} />
                    <span>Beautiful design</span>
                  </div>
                </div>

              </div>

              <div className="preview-website-services">
                <div>
                  <span>01</span>
                  <strong>Hair styling</strong>
                </div>
                <div>
                  <span>02</span>
                  <strong>Makeup</strong>
                </div>
                <div>
                  <span>03</span>
                  <strong>Skincare</strong>
                </div>
              </div>

            </div>
          </div>

          <div className="hero-floating-card">
            <span className="hero-floating-icon">
              <CheckCircle2 size={19} />
            </span>
            <div>
              <strong>Website generated</strong>
              <span>Ready for your business</span>
            </div>
          </div>

        </div>

      </div>

      <div className="hero-bottom-note">
        <LayoutTemplate size={16} />
        <span>Everything you need to bring your online presence to life.</span>
      </div>

    </section>
  );
}
