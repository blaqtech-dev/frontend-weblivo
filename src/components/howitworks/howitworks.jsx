
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  MessageSquareText,
  WandSparkles,
  SlidersHorizontal,
  ArrowRight,
  Check,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import "./howitworks.css";

const steps = [
  {
    number: "01",
    icon: MessageSquareText,
    title: "Describe your idea",
    description:
      "Tell WEBLIVO about your business, the type of website you want, and the features you need. No coding or technical knowledge required.",
    details: ["Describe your business", "Choose your preferred style"],
  },
  {
    number: "02",
    icon: WandSparkles,
    title: "Generate your website",
    description:
      "Our AI transforms your description into a professional website layout, complete with relevant content, sections and beautiful design.",
    details: ["AI-generated layouts", "Professional website content"],
  },
  {
    number: "03",
    icon: SlidersHorizontal,
    title: "Customize and publish",
    description:
      "Make the website yours. Edit text, images, colours and sections, then publish it online when everything looks right.",
    details: ["Edit without coding", "Publish and share your website"],
  },
];

export default function HowItWorks() {
  const [destination, setDestination] = useState(null);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setDestination(data.user ? "/create" : "/signup");
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setDestination(session?.user ? "/create" : "/signup");
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleNavigation = (event) => {
    if (!destination) {
      event.preventDefault();
    }
  };

  return (
    <section className="how-section" id="how-it-works">
      <div className="how-container">
        <div className="how-heading">
          <span className="how-label">HOW WEBLIVO WORKS</span>

          <h2>
            From an idea to a website.
            <span> It's that simple.</span>
          </h2>

          <p>
            You bring the idea. WEBLIVO gives you the tools to turn
            it into a professional online presence in just a few steps.
          </p>
        </div>

        <div className="how-steps">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div className="how-card" key={step.number}>
                <div className="how-card-top">
                  <div className="how-icon">
                    <Icon size={25} strokeWidth={1.8} />
                  </div>
                  <span className="how-number">{step.number}</span>
                </div>

                <div className="how-card-content">
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>

                  <ul>
                    {step.details.map((detail) => (
                      <li key={detail}>
                        <span className="how-check">
                          <Check size={13} />
                        </span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>

                {index !== steps.length - 1 && (
                  <div className="how-connector">
                    <ArrowRight size={19} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="how-bottom">
          <div>
            <h3>Ready to bring your idea to life?</h3>
            <p>Your next website could start with just one description.</p>
          </div>

          <Link
            href={destination || "/signup"}
            onClick={handleNavigation}
            className="how-button"
            aria-disabled={!destination}
          >
            Get started <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}
