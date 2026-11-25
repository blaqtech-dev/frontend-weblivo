
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Upload,
  Image as ImageIcon,
  LoaderCircle,
  Images,
  PanelsTopLeft,
  GalleryVertical,
} from "lucide-react";
import "./imageuploader.css";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];


const destinations = [
  {
    value: "hero",
    label: "Hero image",
    description: "Main homepage image",
    icon: PanelsTopLeft,
  },
  {
    value: "about",
    label: "About image",
    description: "Our story and business introduction",
    icon: ImageIcon,
  },
  {
    value: "logo",
    label: "Business logo",
    description: "Website header logo",
    icon: ImageIcon,
  },
  {
    value: "gallery",
    label: "Gallery",
    description: "Collection and portfolio photos",
    icon: GalleryVertical,
  },
];


export default function ImageUploader({ projectId }) {
  const router = useRouter();

  const [placement, setPlacement] = useState("gallery");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleUpload = async (event) => {
    const files = Array.from(event.target.files || []);

    setMessage("");
    setError("");

    if (!files.length) return;

    if (placement !== "gallery" && files.length > 1) {
      setError("Upload one image at a time for the hero image or logo.");
      event.target.value = "";
      return;
    }

    const invalidFile = files.find(
      (file) =>
        !ALLOWED_TYPES.includes(file.type) ||
        file.size > MAX_FILE_SIZE
    );

    if (invalidFile) {
      setError("Use JPG, PNG or WebP images. Each image must be 5MB or less.");
      event.target.value = "";
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const uploadedFiles = [];

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("Please log in again to upload images.");
      }

      const { data: project, error: projectError } = await supabase
        .from("projects")
        .select("site_data")
        .eq("id", projectId)
        .eq("user_id", user.id)
        .single();

      if (projectError || !project) {
        throw new Error("Could not find this website project.");
      }

      for (const file of files) {
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "-");
        const filePath = `${user.id}/${projectId}/${crypto.randomUUID()}-${safeName}`;

        const { error: uploadError } = await supabase.storage
          .from("website-images")
          .upload(filePath, file, {
            contentType: file.type,
            upsert: false,
          });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("website-images")
          .getPublicUrl(filePath);

        uploadedFiles.push({
          name: file.name,
          url: data.publicUrl,
          path: filePath,
          placement,
        });
      }

      const currentSiteData = project.site_data || {};
      const existingImages = currentSiteData.uploaded_images || [];

      // Hero and logo have one active image each.
      // Gallery images can be uploaded in multiple batches.
      const retainedImages =
        placement === "gallery"
          ? existingImages
          : existingImages.filter(
              (image) => image.placement !== placement
            );

      const updatedImages = [...retainedImages, ...uploadedFiles];

      const { error: updateError } = await supabase
        .from("projects")
        .update({
          site_data: {
            ...currentSiteData,
            uploaded_images: updatedImages,
          },
          updated_at: new Date().toISOString(),
        })
        .eq("id", projectId)
        .eq("user_id", user.id);

      if (updateError) throw updateError;

      setMessage(
        placement === "gallery"
          ? `${uploadedFiles.length} gallery image(s) uploaded successfully.`
          : `${destinations.find((item) => item.value === placement)?.label} uploaded successfully.`
      );

      router.refresh();
    } catch (err) {
      if (uploadedFiles.length) {
        await supabase.storage
          .from("website-images")
          .remove(uploadedFiles.map((file) => file.path));
      }

      setError(err.message || "Image upload failed. Please try again.");
    } finally {
      setLoading(false);
      event.target.value = "";
    }
  };

  const selectedDestination = destinations.find(
    (item) => item.value === placement
  );

  return (
    <div className="image-uploader">
      <div className="image-uploader-heading">
        <div className="image-uploader-icon">
          <Images size={21} />
        </div>

        <div>
          <h3>Manage website images</h3>
          <p>Choose where each image should appear on your website.</p>
        </div>
      </div>

      <div className="image-destination-grid">
        {destinations.map((destination) => {
          const Icon = destination.icon;

          return (
            <button
              type="button"
              key={destination.value}
              className={`image-destination-card ${
                placement === destination.value ? "active" : ""
              }`}
              onClick={() => {
                setPlacement(destination.value);
                setMessage("");
                setError("");
              }}
              disabled={loading}
            >
              <Icon size={20} />
              <strong>{destination.label}</strong>
              <span>{destination.description}</span>
            </button>
          );
        })}
      </div>

      <label className="image-upload-button">
        {loading ? (
          <LoaderCircle size={18} className="image-upload-spinner" />
        ) : (
          <Upload size={18} />
        )}

        {loading
          ? "Uploading..."
          : `Upload ${selectedDestination?.label || "images"}`}

        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple={placement === "gallery"}
          onChange={handleUpload}
          disabled={loading}
          hidden
        />
      </label>

      <p className="image-upload-hint">
        JPG, PNG or WebP. Maximum 5MB per image.
        {placement !== "gallery" &&
          " Uploading a new image will replace the previous one in this position."}
      </p>

      {message && <p className="image-upload-success">{message}</p>}
      {error && <p className="image-upload-error">{error}</p>}
    </div>
  );
}
