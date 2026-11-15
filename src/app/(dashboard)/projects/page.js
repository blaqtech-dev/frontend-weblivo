
import { Suspense } from "react";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import ProjectsClient from "./projectsclient";

export default function ProjectsPage() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: "40px", color: "#777" }}>
          Loading your websites...
        </div>
      }
    >
      <ProjectsContent />
    </Suspense>
  );
}

async function ProjectsContent() {
  await connection();

  const supabase = await createClient();

  const { data: projects, error } = await supabase
    .from("projects")
    .select("id, name, business_name, description, status, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Projects loading error:", error.message);
  }

  return <ProjectsClient initialProjects={projects || []} />;
}
