
import { Suspense } from "react";
import SettingsContent from "./settingscontent";

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="settings-page">
          <p>Loading your settings...</p>
        </div>
      }
    >
      <SettingsContent />
    </Suspense>
  );
}
