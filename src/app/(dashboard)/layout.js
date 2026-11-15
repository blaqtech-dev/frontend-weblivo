
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import DashboardShell from "@/components/dashboard/dashboardshell";

export default function DashboardLayout({ children }) {
  return (
    <Suspense
      fallback={
        <div style={{ padding: "40px", color: "#777" }}>
          Loading your workspace...
        </div>
      }
    >
      <ProtectedDashboard>{children}</ProtectedDashboard>
    </Suspense>
  );
}

async function ProtectedDashboard({ children }) {
  await connection();

  const supabase = await createClient();

  const {
    data: { claims },
    error,
  } = await supabase.auth.getClaims();

  if (error || !claims) {
    redirect("/login");
  }

  return (
    <DashboardShell email={claims.email}>
      {children}
    </DashboardShell>
  );
}
