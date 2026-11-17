
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import AdminNav from "./adminnav";
import "./admin.css";

export default function AdminLayout({ children }) {
  return (
    <Suspense
      fallback={<div style={{ padding: "40px" }}>Loading admin...</div>}
    >
      <ProtectedAdmin>{children}</ProtectedAdmin>
    </Suspense>
  );
}

async function ProtectedAdmin({ children }) {
  await connection();

  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  const claims = data?.claims;

  if (error || !claims) {
    redirect("/login");
  }

  const { data: admin, error: adminError } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", claims.sub)
    .maybeSingle();

  if (adminError || !admin) {
    redirect("/dashboard");
  }

  return (
    <>
      <AdminNav />
      {children}
    </>
  );
}
