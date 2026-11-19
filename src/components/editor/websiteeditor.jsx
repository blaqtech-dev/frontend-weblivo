
"use client";

import { useEffect, useState } from "react";
import { Save, LoaderCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import ImageUploader from "./imageuploader";
import WebsitePreview from "./websitepreview";
import "./websiteeditor.css";

const bookingBusinessTypes = [
  "salon",
  "beauty",
  "photography",
  "consulting",
  "tutoring",
  "education",
  "spa",
  "fitness",
  "healthcare",
];

export default function WebsiteEditor({
  projectId,
  initialWebsiteData,
  uploadedImages = [],
  contactDetails = {},
  businessType = "",
}) {
  const [websiteData, setWebsiteData] = useState(initialWebsiteData);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setWebsiteData(initialWebsiteData);
    setMessage("");
  }, [initialWebsiteData]);

  const normalizedBusinessType = String(businessType).toLowerCase();

  const bookingEnabled = bookingBusinessTypes.some((type) =>
    normalizedBusinessType.includes(type)
  );

  const handleTextChange = (sectionIndex, field, value, itemIndex) => {
    setWebsiteData((previous) => {
      const updated = structuredClone(previous);

      if (sectionIndex === null) {
        updated[field] = value;
        return updated;
      }

      if (itemIndex !== undefined) {
        if (field === "value") {
          updated.sections[sectionIndex].items[itemIndex] = value;
        } else {
          updated.sections[sectionIndex].items[itemIndex][field] = value;
        }
      } else {
        updated.sections[sectionIndex][field] = value;
      }

      return updated;
    });

    setMessage("");
  };

  const saveChanges = async () => {
    try {
      setSaving(true);
      setMessage("");

      const supabase = createClient();

      const { data: latestProject, error: fetchError } = await supabase
        .from("projects")
        .select("site_data")
        .eq("id", projectId)
        .single();

      if (fetchError) throw fetchError;

      const updatedSiteData = {
        ...(latestProject.site_data || {}),
        generated: websiteData,
      };

      const { error: saveError } = await supabase
        .from("projects")
        .update({
          site_data: updatedSiteData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", projectId);

      if (saveError) throw saveError;

      setMessage("Your changes have been saved.");
    } catch (error) {
      console.error("Website save error:", error.message);
      setMessage("Unable to save your changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="website-editor">
      <ImageUploader projectId={projectId} />

      <div className="website-editor-toolbar">
        <div>
          <strong>Edit your website</strong>
          <p>Make changes and save when you're ready.</p>
        </div>

        <button
          type="button"
          onClick={saveChanges}
          disabled={saving}
          className="website-editor-save"
        >
          {saving ? (
            <LoaderCircle size={17} className="website-editor-spinner" />
          ) : (
            <Save size={17} />
          )}
          {saving ? "Saving..." : "Save changes"}
        </button>
      </div>

      {message && (
        <p className="website-editor-message" role="status">
          {message}
        </p>
      )}

      <WebsitePreview
        websiteData={websiteData}
        uploadedImages={uploadedImages}
        contactDetails={contactDetails}
        onTextChange={handleTextChange}
        projectId={projectId}
        bookingEnabled={bookingEnabled}
        isPublished={false}
      />
    </div>
  );
}
