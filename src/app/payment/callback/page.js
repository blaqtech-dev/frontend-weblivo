
"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, LoaderCircle } from "lucide-react";
import "./paymentcallback.css";
import { createClient } from "@/lib/supabase/client";

function PaymentCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState(
    "Please wait while we confirm your payment."
  );

  useEffect(() => {
    let cancelled = false;

    const verifyPayment = async () => {
      try {
        const reference =
          searchParams.get("reference") ||
          searchParams.get("trxref");

        if (!reference) {
          throw new Error("Payment reference was not found.");
        }

        const supabase = createClient();

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session) {
          throw new Error(
            "Please log in again to verify your payment."
          );
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        const response = await fetch(
          `${apiUrl}/api/payments/verify?reference=${encodeURIComponent(reference)}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${session.access_token}`,
              "Content-Type": "application/json",
            },
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Payment verification failed."
          );
        }

        if (!cancelled) {
          setStatus("success");
          setMessage(
            "Your subscription is now active. Your WEBLIVO plan and credits have been updated."
          );
        }
      } catch (error) {
        console.error("Payment callback error:", error);

        if (!cancelled) {
          setStatus("failed");
          setMessage(
            error.message ||
              "We couldn't verify your payment. Please contact support if you were charged."
          );
        }
      }
    };

    verifyPayment();

    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  return (
    <main className="payment-callback-page">
      <div className="payment-callback-card">
        {status === "verifying" && (
          <>
            <LoaderCircle
              size={54}
              className="payment-callback-spinner"
            />
            <h1>Verifying your payment</h1>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle2
              size={58}
              className="payment-callback-success"
            />
            <h1>Payment successful!</h1>
          </>
        )}

        {status === "failed" && (
          <>
            <XCircle
              size={58}
              className="payment-callback-failed"
            />
            <h1>Payment verification failed</h1>
          </>
        )}

        <p>{message}</p>

        {status === "success" && (
          <button onClick={() => router.replace("/dashboard")}>
            Go to Dashboard
          </button>
        )}

        {status === "failed" && (
          <div className="payment-callback-actions">
            <button onClick={() => router.replace("/pricing")}>
              Return to Pricing
            </button>

            <Link href="/dashboard">
              Go to Dashboard
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="payment-callback-page">
          <div className="payment-callback-card">
            <LoaderCircle
              size={45}
              className="payment-callback-spinner"
            />
            <h1>Loading payment details...</h1>
          </div>
        </main>
      }
    >
      <PaymentCallbackContent />
    </Suspense>
  );
}
