
"use client";

import { useState } from "react";
import { Sparkles, LoaderCircle } from "lucide-react";
import { generateWebsite } from "@/services/generationservice";
import "./generationbutton.css";

export default function GenerationButton({
  projectId,
  alreadyGenerated,
  onGenerated,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await generateWebsite(projectId);

      if (!result.success) {
        throw new Error(result.message || "Website generation failed.");
      }

      const newWebsiteData = result.project?.site_data?.generated;

      if (!newWebsiteData) {
        throw new Error("Generated website data was not returned.");
      }

      onGenerated?.(newWebsiteData);

      setSuccess("Your website has been generated successfully!");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Unable to generate your website.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="generation-action">
      <button
        type="button"
        className="generation-button"
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading ? (
          <LoaderCircle size={18} className="generation-spinner" />
        ) : (
          <Sparkles size={18} />
        )}

        {loading
          ? "Creating your website..."
          : alreadyGenerated
            ? "Regenerate website"
            : "Generate my website"}
      </button>

      {loading && (
        <p className="generation-status">
          WEBLIVO AI is designing your website. This may take a little while.
        </p>
      )}

      {error && <p className="generation-error">{error}</p>}
      {success && <p className="generation-success">{success}</p>}
    </div>
  );
}
