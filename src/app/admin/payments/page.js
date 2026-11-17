
import { Suspense } from "react";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import PaymentsContent from "./paymentscontent";

export default function AdminPaymentsPage() {
  return (
    <Suspense
      fallback={<div style={{ padding: "40px" }}>Loading payments...</div>}
    >
      <PaymentsData />
    </Suspense>
  );
}

async function PaymentsData() {
  await connection();

  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "get_admin_payments",
    {
      p_search: "",
      p_status: "all",
    }
  );

  if (error) {
    console.error("Admin payments error:", error.message);

    return (
      <div style={{ padding: "40px" }}>
        Unable to load payment records.
      </div>
    );
  }

  return <PaymentsContent initialPayments={data || []} />;
}
