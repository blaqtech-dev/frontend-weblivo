
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Scissors,
  Camera,
  Utensils,
  BriefcaseBusiness,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import "./whowefor.css";

const audiences = [
  {
    icon: Scissors,
    title: "Beauty & Personal Care",
    examples: "Salons, barbers, nail technicians and makeup artists.",
    number: "01",
  },
  {
    icon: Utensils,
    title: "Food & Hospitality",
    examples: "Restaurants, caterers, bakers and food vendors.",
    number: "02",
  },
  {
    icon: Camera,
    title: "Creative Professionals",
    examples: "Photographers, designers, videographers and creators.",
    number: "03",
  },
  {
    icon: BriefcaseBusiness,
    title: "Service Businesses",
    examples: "Consultants, cleaners, tutors and other service providers.",
    number: "04",
  },
];

export default function WhoWeFor() {
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
    <section className="audience-section" id="who-its-for">
      <div className="audience-container">
        <div className="audience-heading">
          <span className="audience-label">
            <Sparkles size={15} />
            BUILT FOR YOUR BUSINESS
          </span>

          <h2>
            Whatever you do,
            <span> there's a place for you online.</span>
          </h2>

          <p>
            WEBLIVO helps individuals and small businesses create
            professional websites without needing to hire a developer
            or learn how to code.
          </p>
        </div>

        <div className="audience-grid">
          {audiences.map((item) => {
            const Icon = item.icon;

            return (
              <div className="audience-card" key={item.number}>
                <div className="audience-card-top">
                  <div className="audience-icon">
                    <Icon size={24} strokeWidth={1.8} />
                  </div>
                  <span>{item.number}</span>
                </div>

                <h3>{item.title}</h3>
                <p>{item.examples}</p>

                <Link
                  href={destination || "/signup"}
                  onClick={handleNavigation}
                  aria-disabled={!destination}
                  className="audience-link"
                >
                  Create your website
                  <ArrowUpRight size={16} />
                </Link>
              </div>
            );
          })}
        </div>

        <div className="audience-footer">
          <p>
            Have a different business idea?
            <strong> WEBLIVO can help you bring it online too.</strong>
          </p>

          <Link
            href={destination || "/signup"}
            onClick={handleNavigation}
          >
            Start building <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
