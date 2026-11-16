
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { BriefcaseBusiness, Sun, Moon, Loader2, Save } from "lucide-react";

export default function WorkspaceForm({ userId, initialSettings }) {

    const router = useRouter();
  const [workspaceName, setWorkspaceName] = useState(
    initialSettings?.workspace_name || "My Workspace"
  );

  const [appearance, setAppearance] = useState(
    initialSettings?.appearance || "light"
  );

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const supabase = createClient();

    const { error } = await supabase
      .from("workspace_settings")
      .upsert(
        {
          user_id: userId,
          workspace_name: workspaceName.trim(),
          appearance,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );

    if (error) {
      setMessage(error.message);
      setMessageType("error");
    } else {
  setMessage("Your workspace preferences have been saved.");
  setMessageType("success");

  router.refresh();
}

    setLoading(false);
  };

  return (
    <form className="settings-workspace-form" onSubmit={handleSave}>
      <div className="settings-password-intro">
        <div className="settings-option-icon">
          <BriefcaseBusiness size={19} />
        </div>
        <div>
          <h3>Workspace Preferences</h3>
          <p>Personalize your WEBLIVO workspace.</p>
        </div>
      </div>

      <div className="settings-input-group">
        <label htmlFor="workspace-name">Workspace Name</label>
        <input
          id="workspace-name"
          type="text"
          value={workspaceName}
          onChange={(e) => setWorkspaceName(e.target.value)}
          placeholder="Enter workspace name"
          maxLength={50}
          required
        />
      </div>

      <div className="settings-appearance">
        <label>Workspace Appearance</label>

        <div className="settings-appearance-options">
          <button
            type="button"
            className={appearance === "light" ? "selected" : ""}
            onClick={() => setAppearance("light")}
          >
            <Sun size={19} />
            <span>Light</span>
          </button>

          <button
            type="button"
            className={appearance === "dark" ? "selected" : ""}
            onClick={() => setAppearance("dark")}
          >
            <Moon size={19} />
            <span>Dark</span>
          </button>
        </div>
      </div>

      {message && (
        <p className={`settings-password-message ${messageType}`}>
          {message}
        </p>
      )}

      <button
        type="submit"
        className="settings-save-password"
        disabled={loading || !workspaceName.trim()}
      >
        {loading ? (
          <>
            <Loader2 size={16} className="settings-spinner" />
            Saving...
          </>
        ) : (
          <>
            <Save size={16} />
            Save Preferences
          </>
        )}
      </button>
    </form>
  );
}
