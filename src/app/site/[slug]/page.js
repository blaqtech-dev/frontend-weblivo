
import { Suspense } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import WebsitePreview from "@/components/editor/websitepreview";

export default function PublicWebsitePage({ params }) {
  return (
    <Suspense fallback={<p>Loading website...</p>}>
      <PublicWebsiteContent params={params} />
    </Suspense>
  );
}

async function PublicWebsiteContent({ params }) {
  const { slug } = await params;

  await connection();

  const supabase = await createClient();

  const { data: project, error } = await supabase
    .from("projects")
    .select("id, name, business_name, business_type, status, subdomain, site_data")
    .eq("subdomain", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !project || !project.site_data?.generated) {
    notFound();
  }

  // Enable appointment booking for supported business categories.
 const businessType = String(
  project.business_type || ""
).toLowerCase();
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

  const bookingEnabled = bookingBusinessTypes.some((type) =>
    businessType.includes(type)
  );

  return (
    <WebsitePreview
      websiteData={project.site_data.generated}
      uploadedImages={project.site_data.uploaded_images || []}
      contactDetails={project.site_data.contact_details || {}}
      projectId={project.id}
      bookingEnabled={bookingEnabled}
      isPublished={true}
    />
  );
}
