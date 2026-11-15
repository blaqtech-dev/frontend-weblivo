
import "./dashboard.css";
import {
  Globe,
  Sparkles,
  Plus,
  ArrowUpRight,
  Clock3,
  LayoutTemplate,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
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
          <h2>0</h2>
          <p>Your website projects</p>
        </div>

        <div className="overview-stat-card">
          <div className="overview-stat-top">
            <span>AI Credits</span>
            <Sparkles size={19} />
          </div>
          <h2>—</h2>
          <p>Your available generation credits</p>
        </div>

        <div className="overview-stat-card">
          <div className="overview-stat-top">
            <span>Published Websites</span>
            <ArrowUpRight size={19} />
          </div>
          <h2>0</h2>
          <p>Websites available online</p>
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
          <span>No recent activity</span>
        </div>
      </section>
    </div>
  );
}
