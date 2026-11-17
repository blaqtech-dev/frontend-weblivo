
import { Suspense } from "react";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import AdminOverview from "./adminoverview";

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: "40px" }}>
          Loading admin dashboard...
        </div>
      }
    >
      <AdminData />
    </Suspense>
  );
}

async function AdminData() {
  await connection();

  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "get_admin_dashboard_data"
  );

  if (error) {
    console.error("Admin dashboard error:", error.message);

    return (
      <div style={{ padding: "40px" }}>
        Unable to load admin dashboard data.
      </div>
    );
  }

  return (
    <AdminOverview
      stats={{
        totalUsers: Number(data.stats.total_users || 0),
        proUsers: Number(data.stats.pro_users || 0),
        businessUsers: Number(data.stats.business_users || 0),
        freeUsers: Number(data.stats.free_users || 0),
        totalRevenue: Number(data.stats.total_revenue || 0) / 100,
      }}
      payments={data.payments || []}
      billing={data.billing || []}
    />
  );
}
