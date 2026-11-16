
import { Suspense } from "react";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

import {
  Globe,
  Sparkles,
  Plus,
  ArrowUpRight,
  Clock3,
  LayoutTemplate,
} from "lucide-react";

import "./dashboard.css";

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: "40px", color: "#777" }}>
          Loading your dashboard...
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}

async function DashboardContent() {
  await connection();

  const supabase = await createClient();

  const {
    data: { claims },
    error: authError,
  } = await supabase.auth.getClaims();

  if (authError || !claims) {
    return <p>Unable to load your dashboard. Please log in again.</p>;
  }

  const userId = claims.sub;

  // Fetch the user's projects.
  const { data: projects, error: projectsError } = await supabase
    .from("projects")
    .select("id, name, business_name, description, status, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (projectsError) {
    console.error("Dashboard projects error:", projectsError.message);
  }

  // Fetch the user's plan and billing information.
  const { data: billing, error: billingError } = await supabase
    .from("user_billing")
    .select(
      "plan, credits_remaining, max_projects, max_published_websites"
    )
    .eq("user_id", userId)
    .maybeSingle();

  if (billingError) {
    console.error("Dashboard billing error:", billingError.message);
  }

  const userProjects = projects || [];

  const totalProjects = userProjects.length;

  const publishedProjects = userProjects.filter(
    (project) => project.status?.toLowerCase() === "published"
  ).length;

  const recentProjects = userProjects.slice(0, 3);

  const currentPlan = billing?.plan || "free";

  const creditsRemaining = billing?.credits_remaining ?? 0;

  const maxProjects = billing?.max_projects ?? null;

  const maxPublishedWebsites =
    billing?.max_published_websites ?? 1;

  const projectLimit =
    maxProjects === null ? "Unlimited" : `${totalProjects} / ${maxProjects}`;

  const publishedLimit =
    `${publishedProjects} / ${maxPublishedWebsites}`;

  const planName =
    currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1);

  return (
    <div className="overview-page">
      <section className="overview-welcome">
        <div>
          <p className="overview-eyebrow">YOUR WORKSPACE</p>
          <h1>Welcome to WEBLIVO 👋</h1>
          <p>
            Turn your ideas into beautiful websites. What would you
            like to create today?
          </p>

          <div className="overview-plan-badge">
            <Sparkles size={14} />
            {planName} Plan
          </div>
        </div>

        <Link href="/create" className="overview-create-button">
          <Plus size={18} />
          Create a website
        </Link>
      </section>

      <section className="overview-stats">
        <div className="overview-stat-card">
          <div className="overview-stat-top">
            <span>My Websites</span>
            <Globe size={19} />
          </div>

          <h2>{totalProjects}</h2>

          <p>
            {maxProjects === null
              ? "Unlimited projects"
              : `${projectLimit} projects used`}
          </p>
        </div>

        <div className="overview-stat-card">
          <div className="overview-stat-top">
            <span>AI Credits</span>
            <Sparkles size={19} />
          </div>

          <h2>{creditsRemaining}</h2>

          <p>Available AI generation credits</p>
        </div>

        <div className="overview-stat-card">
          <div className="overview-stat-top">
            <span>Published Websites</span>
            <ArrowUpRight size={19} />
          </div>

          <h2>{publishedProjects}</h2>

          <p>{publishedLimit} publishing slots used</p>
        </div>
      </section>

      <section className="overview-main-section">
        <div className="overview-section-heading">
          <div>
            <h2>Your websites</h2>
            <p>Manage and continue working on your projects.</p>
          </div>

          <Link href="/projects" className="overview-view-link">
            View all <ArrowUpRight size={15} />
          </Link>
        </div>

        {recentProjects.length > 0 ? (
          <div className="overview-project-list">
            {recentProjects.map((project) => (
              <div className="overview-project-item" key={project.id}>
                <div className="overview-project-icon">
                  <Globe size={20} />
                </div>

                <div className="overview-project-info">
                  <h3>{project.name}</h3>
                  <p>
                    {project.business_name || "Business name not added"}
                  </p>
                </div>

                <span
                  className={`overview-project-status ${project.status?.toLowerCase()}`}
                >
                  {project.status || "Draft"}
                </span>

                <Link
                  href={`/editor/${project.id}`}
                  className="overview-project-link"
                >
                  Open <ArrowUpRight size={15} />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="overview-empty-state">
            <div className="overview-empty-icon">
              <Globe size={28} />
            </div>

            <h3>Your next big idea starts here</h3>

            <p>
              You haven't created a website yet. Describe your idea
              and let WEBLIVO help you bring it to life.
            </p>

            <Link href="/create" className="overview-empty-button">
              <Sparkles size={17} />
              Create your first website
            </Link>
          </div>
        )}
      </section>

      <section className="overview-bottom-grid">
        <div className="overview-info-card">
          <div className="overview-info-icon">
            <LayoutTemplate size={21} />
          </div>

          <h3>Explore website possibilities</h3>

          <p>
            Discover what you can build with WEBLIVO, from business
            websites to professional portfolios.
          </p>

          <span>Templates coming soon</span>
        </div>

        <div className="overview-info-card">
          <div className="overview-info-icon">
            <Clock3 size={21} />
          </div>

          <h3>Recent activity</h3>

          <p>
            Your recent website projects and activities will appear
            here once you start building.
          </p>

          <span>
            {totalProjects > 0
              ? `${totalProjects} website project${totalProjects === 1 ? "" : "s"} created`
              : "No recent activity"}
          </span>
        </div>
      </section>
    </div>
  );
}
