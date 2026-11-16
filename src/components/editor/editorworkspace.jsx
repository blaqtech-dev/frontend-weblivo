
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  Eye,
  Globe,
  LoaderCircle,
  ExternalLink,
} from "lucide-react";

import GenerationButton from "./generationbutton";
import WebsiteEditor from "./websiteeditor";
import { publishWebsite } from "@/services/generationservice";

export default function EditorWorkspace({ project }) {
  const [websiteData, setWebsiteData] = useState(
    project.site_data?.generated || null
  );

  const [status, setStatus] = useState(project.status);
  const [publishedUrl, setPublishedUrl] = useState(
    project.status === "published" && project.subdomain
      ? `/site/${project.subdomain}`
      : ""
  );

const [publishing, setPublishing] = useState(false);
const [publishError, setPublishError] = useState("");
const [publishLimitReached, setPublishLimitReached] = useState(false);

  const uploadedImages = project.site_data?.uploaded_images || [];
  const contactDetails = project.site_data?.contact_details || {};

const handlePublish = async () => {
  try {
    setPublishing(true);
    setPublishError("");
    setPublishLimitReached(false);

    const result = await publishWebsite(project.id);

    if (!result.success) {
      throw new Error(result.message || "Unable to publish website.");
    }

    setStatus("published");
    setPublishedUrl(`/site/${result.subdomain}`);

  } catch (error) {
    console.error("Publishing error:", error);

    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong while publishing.";

    setPublishError(message);

    if (message.toLowerCase().includes("publishing limit")) {
      setPublishLimitReached(true);
    }
  } finally {
    setPublishing(false);
  }
};

  return (
    <div className="editor-page">
      <Link href="/projects" className="editor-back">
        <ArrowLeft size={17} />
        Back to My Websites
      </Link>

      <div className="editor-heading">
        <div>
          <span className="editor-status">{status}</span>
          <h1>{project.business_name || project.name}</h1>
          <p>Your website project workspace</p>
        </div>
      </div>

      {!websiteData ? (
        <>
          <div className="editor-card">
            <div className="editor-card-heading">
              <Sparkles size={20} />
              <h2>Business information</h2>
            </div>

            <div className="editor-detail">
              <span>Business name</span>
              <strong>{project.business_name || "Not provided"}</strong>
            </div>

            <div className="editor-detail">
              <span>Business type</span>
              <strong>
                {project.site_data?.business_type || "Not provided"}
              </strong>
            </div>

            <div className="editor-detail">
              <span>Design style</span>
              <strong>
                {project.site_data?.design_style || "Not selected"}
              </strong>
            </div>

            <div className="editor-description">
              <span>Website description</span>
              <p>{project.description || "No description provided."}</p>
            </div>
          </div>

          <div className="editor-generation">
            <div className="editor-generation-icon">
              <Sparkles size={25} />
            </div>

            <h2>Your website starts here</h2>
            <p>
              Your project details are ready. Let WEBLIVO AI transform them
              into a professional website.
            </p>

            <GenerationButton
              projectId={project.id}
              alreadyGenerated={false}
              onGenerated={setWebsiteData}
            />
          </div>
        </>
      ) : (
        <div className="editor-preview-workspace">
          <div className="editor-preview-heading">
            <div>
              <h2>
                <Eye size={20} />
                Website editor
              </h2>
              <p>
                Customize your generated website and save when you're ready.
              </p>
            </div>

            <div className="editor-publish-actions">
              <GenerationButton
                projectId={project.id}
                alreadyGenerated={true}
                onGenerated={setWebsiteData}
              />

              <button
                type="button"
                className="editor-publish-button"
                onClick={handlePublish}
                disabled={publishing}
              >
                {publishing ? (
                  <>
                    <LoaderCircle size={17} className="editor-publish-spinner" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Globe size={17} />
                    {status === "published" ? "Update Published Site" : "Publish Website"}
                  </>
                )}
              </button>
            </div>
          </div>
{publishError && (
  <div className="editor-publish-error">
    <p>{publishError}</p>

    {publishLimitReached && (
      <Link href="/pricing" className="editor-pricing-link">
        View pricing plans →
      </Link>
    )}
  </div>
)}

          {publishedUrl && status === "published" && (
            <div className="editor-published-box">
              <div>
                <strong>
                  <Globe size={17} />
                  Your website is published!
                </strong>

                <p>{publishedUrl}</p>
              </div>

              <Link
                href={publishedUrl}
                target="_blank"
                className="editor-view-published"
              >
                Visit Website
                <ExternalLink size={15} />
              </Link>
            </div>
          )}

          <WebsiteEditor
            projectId={project.id}
            initialWebsiteData={websiteData}
            uploadedImages={uploadedImages}
            contactDetails={contactDetails}
          />
        </div>
      )}
    </div>
  );
}
