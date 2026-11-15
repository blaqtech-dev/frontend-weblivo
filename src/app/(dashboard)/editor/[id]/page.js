
import { Suspense } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import EditorWorkspace from "@/components/editor/editorworkspace";
import "./editor.css";

export default function EditorPage({ params }) {
  return (
    <Suspense
      fallback={
        <div className="editor-loading">Loading your project...</div>
      }
    >
      <EditorContent params={params} />
    </Suspense>
  );
}

async function EditorContent({ params }) {
  const { id } = await params;

  await connection();

  const supabase = await createClient();

  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !project) notFound();

  return <EditorWorkspace project={project} />;
}
