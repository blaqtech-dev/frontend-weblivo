
import { Suspense } from "react";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import SubscriptionsContent from "./subscriptionscontent";

export default function AdminSubscriptionsPage() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: "40px" }}>
          Loading subscriptions...
        </div>
      }
    >
      <SubscriptionsData />
    </Suspense>
  );
}

async function SubscriptionsData() {
  await connection();

  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "get_admin_subscriptions",
    {
      p_search: "",
      p_plan: "all",
      p_status: "all",
    }
  );

  if (error) {
    console.error("Admin subscriptions error:", error.message);

    return (
      <div style={{ padding: "40px" }}>
        Unable to load subscription records.
      </div>
    );
  }

  return (
    <SubscriptionsContent
      initialSubscriptions={data || []}
    />
  );
}
