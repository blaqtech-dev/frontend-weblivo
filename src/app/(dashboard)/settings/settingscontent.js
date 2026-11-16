
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  UserRound,
  ShieldCheck,
  Mail,
  CalendarDays,
  Sparkles,
} from "lucide-react";
import PasswordForm from "@/components/settings/passwordform";
import WorkspaceForm from "@/components/settings/workspaceform";
import "./settings.css";

export default async function SettingsContent() {
  await connection();

  const supabase = await createClient();

  const {
    data: { claims },
  } = await supabase.auth.getClaims();

  const email = claims?.email || "Not available";
  const userId = claims?.sub;

  const { data: workspaceSettings } = await supabase
    .from("workspace_settings")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  return (
    <div className="settings-page">
      <div className="settings-heading">
        <div>
          <p className="settings-eyebrow">PREFERENCES</p>
          <h1>Settings</h1>
          <p>Manage your account and keep your WEBLIVO workspace up to date.</p>
        </div>
      </div>

      {/* PROFILE INFORMATION */}
      <section className="settings-section">
        <div className="settings-section-heading">
          <div className="settings-heading-icon">
            <UserRound size={19} />
          </div>
          <div>
            <h2>Profile Information</h2>
            <p>Your personal account information.</p>
          </div>
        </div>

        <div className="settings-card">
          <div className="settings-profile">
            <div className="settings-avatar">
              {email.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3>Your WEBLIVO Account</h3>
              <p>Personal workspace</p>
            </div>
          </div>

          <div className="settings-divider" />

          <div className="settings-detail">
            <div className="settings-detail-label">
              <Mail size={17} />
              <span>Email Address</span>
            </div>
            <strong>{email}</strong>
          </div>

          <div className="settings-detail">
            <div className="settings-detail-label">
              <CalendarDays size={17} />
              <span>Account Status</span>
            </div>
            <strong className="settings-status">
              <span />
              Active
            </strong>
          </div>
        </div>
      </section>

      {/* SECURITY */}
      <section className="settings-section">
        <div className="settings-section-heading">
          <div className="settings-heading-icon">
            <ShieldCheck size={19} />
          </div>
          <div>
            <h2>Security</h2>
            <p>Manage the security of your account.</p>
          </div>
        </div>

        <div className="settings-card">
          <PasswordForm email={email} />
        </div>
      </section>

      {/* WORKSPACE */}
      <section className="settings-section">
        <div className="settings-section-heading">
          <div className="settings-heading-icon">
            <Sparkles size={19} />
          </div>
          <div>
            <h2>Workspace</h2>
            <p>Personalize your WEBLIVO workspace.</p>
          </div>
        </div>

        <div className="settings-card">
          <WorkspaceForm
            userId={userId}
            initialSettings={workspaceSettings}
          />
        </div>
      </section>
    </div>
  );
}
