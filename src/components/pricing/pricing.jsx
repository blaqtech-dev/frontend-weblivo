
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Check,
  Sparkles,
  Zap,
  Crown,
  ArrowRight,
  HelpCircle,
  LoaderCircle,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { initializePayment } from "@/services/paymentservice";
import "./pricing.css";

const plans = [
  {
    name: "Free",
    planId: "free",
    description: "Explore WEBLIVO and bring your first website idea to life.",
    price: "₦0",
    period: "Forever",
    credits: "3 free credits (one-time)",
    icon: Sparkles,
    popular: false,
    features: [
      "Up to 2 website projects",
      "3 AI generation credits",
      "Publish 1 website",
      "Free WEBLIVO subdomain",
      "Website editing",
      "All available design styles",
      "WEBLIVO branding",
    ],
    button: "Start for free",
  },
  {
    name: "Pro",
    planId: "pro",
    description: "More creative freedom for businesses ready to grow.",
    price: "₦5,000",
    period: "per month",
    credits: "30 AI credits every month",
    icon: Zap,
    popular: true,
    features: [
      "Up to 5 website projects",
      "30 monthly AI credits",
      "Publish up to 5 websites",
      "Free WEBLIVO subdomains",
      "No WEBLIVO branding",
      "Website editing",
      "All available design styles",
      "Priority generation where available",
    ],
    button: "Choose Pro",
  },
  {
    name: "Business",
    planId: "business",
    description:
      "More power and flexibility for businesses managing multiple websites.",
    price: "₦12,000",
    period: "per month",
    credits: "100 AI credits every month",
    icon: Crown,
    popular: false,
    features: [
      "Unlimited website projects",
      "100 monthly AI credits",
      "Publish up to 20 websites",
      "Free WEBLIVO subdomains",
      "No WEBLIVO branding",
      "Website editing",
      "All available design styles",
      "Priority generation where available",
    ],
    button: "Choose Business",
  },
];

export default function Pricing() {
  const [user, setUser] = useState(null);
  const [currentPlan, setCurrentPlan] = useState("free");
  const [authLoading, setAuthLoading] = useState(true);

  const [processingPlan, setProcessingPlan] = useState("");
  const [paymentError, setPaymentError] = useState("");

  useEffect(() => {
    const supabase = createClient();

    const loadUser = async () => {
      try {
        const {
          data: { user: currentUser },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) throw authError;

        setUser(currentUser);

        if (currentUser) {
          const { data: billing, error: billingError } =
            await supabase
              .from("user_billing")
              .select("plan")
              .eq("user_id", currentUser.id)
              .maybeSingle();

          if (billingError) throw billingError;

          setCurrentPlan(billing?.plan || "free");
        } else {
          setCurrentPlan("free");
        }
      } catch (error) {
        console.error("Pricing account error:", error);
      } finally {
        setAuthLoading(false);
      }
    };

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadUser();
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubscribe = async (planId) => {
    if (!user || !["pro", "business"].includes(planId)) {
      return;
    }

    setPaymentError("");
    setProcessingPlan(planId);

    try {
      const result = await initializePayment(planId);

      if (!result?.authorizationUrl) {
        throw new Error("Paystack checkout link was not returned.");
      }

      // Redirect the user to Paystack's secure checkout.
      window.location.href = result.authorizationUrl;
    } catch (error) {
      console.error("Subscription payment error:", error);

      const message =
        error.response?.data?.message ||
        error.message ||
        "Unable to start your subscription. Please try again.";

      setPaymentError(message);
      setProcessingPlan("");
    }
  };

  return (
    <section className="pricing-section" id="pricing">
      <div className="pricing-container">
        <div className="pricing-heading">
          <span className="pricing-label">
            <Sparkles size={15} />
            SIMPLE AND AFFORDABLE
          </span>

          <h2>
            Build more.
            <span> Pay only for what you need.</span>
          </h2>

          <p>
            Start with a free plan, explore your possibilities,
            and upgrade when your business needs more.
            No complicated pricing.
          </p>
        </div>

        {paymentError && (
          <div className="pricing-payment-error" role="alert">
            {paymentError}
          </div>
        )}

        <div className="pricing-grid">
          {plans.map((plan) => {
            const Icon = plan.icon;

            const isCurrentPlan =
              user && currentPlan === plan.planId;

            const isProcessing =
              processingPlan === plan.planId;

            let buttonText = plan.button;
            let buttonDisabled = false;

            if (authLoading) {
              buttonText = "Loading...";
              buttonDisabled = true;
            } else if (!user) {
              buttonText =
                plan.planId === "free"
                  ? "Start for free"
                  : "Get started";
            } else if (isCurrentPlan) {
              buttonText = "Current plan";
              buttonDisabled = true;
            } else if (plan.planId === "free") {
              buttonText = "Free plan";
              buttonDisabled = true;
           } else if (isProcessing) {
  buttonText = "Connecting to Paystack...";
  buttonDisabled = true;
} else if (processingPlan) {
  buttonDisabled = true;
}

            return (
              <article
                className={`pricing-card ${
                  plan.popular ? "pricing-popular" : ""
                }`}
                key={plan.name}
              >
                {plan.popular && (
                  <span className="pricing-popular-tag">
                    RECOMMENDED
                  </span>
                )}

                <div className="pricing-icon">
                  <Icon size={23} />
                </div>

                <h3>{plan.name}</h3>

                <p className="pricing-description">
                  {plan.description}
                </p>

                <div className="pricing-price">
                  <strong>{plan.price}</strong>
                  <span>{plan.period}</span>
                </div>

                <div className="pricing-credit">
                  <Sparkles size={16} />
                  <span>{plan.credits}</span>
                </div>

                {user ? (
                  <button
                    type="button"
                    className={`pricing-button ${
                      buttonDisabled
                        ? "pricing-button-disabled"
                        : ""
                    }`}
                    disabled={buttonDisabled}
                    onClick={() => handleSubscribe(plan.planId)}
                  >
                    {isProcessing ? (
                      <LoaderCircle
                        size={17}
                        className="pricing-spinner"
                      />
                    ) : (
                      <>
                        {buttonText}
                        {!buttonDisabled && (
                          <ArrowRight size={17} />
                        )}
                      </>
                    )}
                  </button>
                ) : (
                  <Link
                    href="/signup"
                    className="pricing-button"
                  >
                    {buttonText}
                    <ArrowRight size={17} />
                  </Link>
                )}

                <div className="pricing-divider" />

                <span className="pricing-includes">
                  PLAN INCLUDES
                </span>

                <ul className="pricing-features">
                  {plan.features.map((feature) => (
                    <li key={feature}>
                      <span className="pricing-check">
                        <Check size={14} />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>

        <div className="pricing-credit-info">
          <div className="pricing-credit-icon">
            <HelpCircle size={21} />
          </div>

          <div>
            <h3>What are AI credits?</h3>
            <p>
              AI credits power website generation and other
              AI features. Your plan determines how many credits
              you receive. We'll show your available balance
              inside your dashboard.
            </p>
          </div>
        </div>

        <div className="pricing-bottom">
          <p>
            Have questions about choosing a plan?
            <span>
              {" "}We're keeping WEBLIVO simple and accessible.
            </span>
          </p>

          <Link href={user ? "/dashboard" : "/signup"}>
            {user ? "Go to Dashboard" : "Get started"}
            <ArrowRight size={16} />
          </Link>
        </div>

        <p className="pricing-note">
          Prices are displayed in Nigerian Naira (NGN).
          Subscription payments will be processed securely through Paystack.
        </p>
      </div>
    </section>
  );
}
