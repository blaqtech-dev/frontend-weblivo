
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { LockKeyhole, Eye, EyeOff, Loader2 } from "lucide-react";

export default function PasswordForm({ email }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage("");

    if (newPassword.length < 8) {
      setMessage("Your new password must contain at least 8 characters.");
      setMessageType("error");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Your new passwords do not match.");
      setMessageType("error");
      return;
    }

    if (currentPassword === newPassword) {
      setMessage("Your new password must be different from your current password.");
      setMessageType("error");
      return;
    }

    setLoading(true);

    const supabase = createClient();

    const { error: signInError } =
      await supabase.auth.signInWithPassword({
        email,
        password: currentPassword,
      });

    if (signInError) {
      setMessage("Your current password is incorrect.");
      setMessageType("error");
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      setMessage(updateError.message);
      setMessageType("error");
      setLoading(false);
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setMessage("Your password has been updated successfully.");
    setMessageType("success");
    setLoading(false);
  };

  return (
    <form className="settings-password-form" onSubmit={handlePasswordChange}>
      <div className="settings-password-intro">
        <div className="settings-option-icon">
          <LockKeyhole size={19} />
        </div>
        <div>
          <h3>Change Password</h3>
          <p>Update your password to keep your account secure.</p>
        </div>
      </div>

      <div className="settings-password-fields">
        <div className="settings-input-group">
          <label>Current Password</label>
          <input
            type={showPasswords ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter your current password"
            required
          />
        </div>

        <div className="settings-input-group">
          <label>New Password</label>
          <input
            type={showPasswords ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter your new password"
            minLength={8}
            required
          />
        </div>

        <div className="settings-input-group">
          <label>Confirm New Password</label>
          <input
            type={showPasswords ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your new password"
            minLength={8}
            required
          />
        </div>
      </div>

      <button
        type="button"
        className="settings-show-password"
        onClick={() => setShowPasswords(!showPasswords)}
      >
        {showPasswords ? <EyeOff size={15} /> : <Eye size={15} />}
        {showPasswords ? "Hide passwords" : "Show passwords"}
      </button>

      {message && (
        <p className={`settings-password-message ${messageType}`}>
          {message}
        </p>
      )}

      <button
        type="submit"
        className="settings-save-password"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 size={16} className="settings-spinner" />
            Updating password...
          </>
        ) : (
          "Update Password"
        )}
      </button>
    </form>
  );
}
