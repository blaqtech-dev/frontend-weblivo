
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

import {
  Sparkles,
  MonitorSmartphone,
  Palette,
  MousePointerClick,
  Globe,
  Rocket,
} from "lucide-react";

import "./features.css";

const features = [
  {
    icon: Sparkles,
    title: "AI-powered website creation",
    description:
      "Simply describe your business and the website you imagine. Our AI turns your ideas into a professional website.",
    number: "01",
  },
  {
    icon: Palette,
    title: "Beautiful, modern designs",
    description:
      "Create visually stunning websites with carefully designed layouts, elegant colours and professional styles.",
    number: "02",
  },
  {
    icon: MousePointerClick,
    title: "Easy visual editing",
    description:
      "Make changes to your website without touching code. Edit text, images, colours and sections with ease.",
    number: "03",
  },
  {
    icon: MonitorSmartphone,
    title: "Fully responsive websites",
    description:
      "Give your visitors a seamless experience across desktops, tablets and mobile devices.",
    number: "04",
  },
  {
    icon: Globe,
    title: "Publish your website",
    description:
      "Bring your website online and share it with customers through your own unique website link.",
    number: "05",
  },
  {
    icon: Rocket,
    title: "Build faster, grow smarter",
    description:
      "Spend less time worrying about website development and more time focusing on growing your business.",
    number: "06",
  },
];

export default function Features() {
  const [destination, setDestination] = useState("/signup");

  useEffect(() => {
    const supabase = createClient();

    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setDestination(user ? "/create" : "/signup");
    };

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setDestination(session?.user ? "/create" : "/signup");
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <section className="features-section" id="features">
      <div className="features-container">
        <div className="features-heading">
          <span className="features-label">
            <Sparkles size={15} />
            WHY CHOOSE WEBLIVO
          </span>

          <h2>
            Everything you need to
            <span> build and grow online.</span>
          </h2>

          <p>
            From your first idea to a published website,
            WEBLIVO gives you the tools to bring your business online
            without the complexity of traditional web development.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div className="feature-card" key={feature.number}>
                <div className="feature-card-top">
                  <div className="feature-icon">
                    <Icon size={23} strokeWidth={1.8} />
                  </div>

                  <span className="feature-number">
                    {feature.number}
                  </span>
                </div>

                <h3>{feature.title}</h3>

                <p>{feature.description}</p>

                <div className="feature-card-line"></div>
              </div>
            );
          })}
        </div>

        <div className="features-bottom">
          <div className="features-bottom-content">
            <span className="features-bottom-icon">
              <Sparkles size={20} />
            </span>

            <div>
              <h3>Your idea deserves a great website.</h3>
              <p>
                Let WEBLIVO help you turn that idea into reality.
              </p>
            </div>
          </div>

          <Link
            href={destination}
            className="features-bottom-button"
          >
            Start building
          </Link>
        </div>
      </div>
    </section>
  );
}
