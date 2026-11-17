
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

import {
  ArrowUpRight,
  Sparkles,
  ExternalLink,
} from "lucide-react";

import "./templateshowcase.css";

const templates = [
  {
    name: "Lumi Beauty",
    category: "Beauty & Salon",
    description: "A modern and elegant beauty studio website.",
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=900",
    style: "beauty",
    tag: "POPULAR",
  },
  {
    name: "Urban Taste",
    category: "Restaurant & Food",
    description: "A delicious online experience for food businesses.",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900",
    style: "restaurant",
    tag: "FOOD",
  },
  {
    name: "Frame Studio",
    category: "Photography",
    description: "A creative portfolio for photographers and artists.",
    image:
      "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=900",
    style: "photography",
    tag: "CREATIVE",
  },
  {
    name: "Elevate Consulting",
    category: "Business & Consulting",
    description: "A professional online presence for growing businesses.",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900",
    style: "business",
    tag: "BUSINESS",
  },
];

export default function TemplateShowcase() {
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
    <section className="template-section" id="templates">
      <div className="template-container">
        <div className="template-heading">
          <span className="template-label">
            <Sparkles size={15} />
            EXPLORE THE POSSIBILITIES
          </span>

          <h2>
            Websites for every idea.
            <span> Designed by AI.</span>
          </h2>

          <p>
            Whether you're running a small business or building
            your personal brand, WEBLIVO helps you create a website
            that represents you professionally.
          </p>
        </div>

        <div className="template-grid">
          {templates.map((template) => (
            <article className="template-card" key={template.name}>
              <div className={`template-image ${template.style}`}>
                <img src={template.image} alt={template.name} />

                <span className="template-tag">{template.tag}</span>

                <div className="template-image-overlay">
                  <span>Website concept</span>
                  <ExternalLink size={19} />
                </div>
              </div>

              <div className="template-info">
                <div>
                  <span className="template-category">
                    {template.category}
                  </span>

                  <h3>{template.name}</h3>
                  <p>{template.description}</p>
                </div>

                <span className="template-arrow">
                  <ArrowUpRight size={19} />
                </span>
              </div>
            </article>
          ))}
        </div>

        <div className="template-bottom">
          <div>
            <h3>Your business. Your style. Your website.</h3>
            <p>
              These are just examples. Your own website starts
              with the idea you describe.
            </p>
          </div>

          <Link href={destination} className="template-button">
            Create your website <ArrowUpRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}
