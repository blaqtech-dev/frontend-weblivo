
import { Suspense } from "react";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import UsersContent from "./userscontent";
import "./users.css";
export default function AdminUsersPage() {
  return (
    <Suspense
      fallback={<div style={{ padding: "40px" }}>Loading users...</div>}
    >
      <UsersData />
    </Suspense>
  );
}

async function UsersData() {
  await connection();

  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "get_admin_users",
    { p_search: "" }
  );

  if (error) {
    console.error("Admin users error:", error.message);

    return (
      <div style={{ padding: "40px" }}>
        Unable to load users. Please refresh the page.
      </div>
    );
  }

  return <UsersContent initialUsers={data || []} />;
}
